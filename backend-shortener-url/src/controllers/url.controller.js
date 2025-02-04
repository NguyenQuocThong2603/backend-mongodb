import { nanoid } from 'nanoid';
import urlRegex from 'url-regex';
import statusCode from '../constants/statusCode.js';
import UrlService from '../services/url.service.js';
import clientRedis from '../config/redis.js';

const UrlController = {

  async createUrl(req, res) {
    const { url } = req.body;

    if (!url || urlRegex({ exact: true }).test(url) === false) {
      return res.status(statusCode.BAD_REQUEST).json({ message: 'Invalid request' });
    }

    let newShortUrl = null;
    try {
      const urlID = nanoid(10);

      if (req.session.user !== undefined) {
        newShortUrl = await UrlService.createUrl(urlID, url, req.session.user);
      } else {
        newShortUrl = await UrlService.createUrl(urlID, url);
      }
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }

    const urlDTO = {
      _id: newShortUrl._id,
      urlID: newShortUrl.urlID,
      originalUrl: newShortUrl.originalUrl,
      count: newShortUrl.count,
    };
    return res.status(statusCode.CREATED).json({ message: 'Create short url successfully', url: urlDTO });
  },

  async redirectUrl(req, res) {
    const { urlID } = req.params;

    try {
      const url = await UrlService.findUrlByUrlID(urlID);

      if (url !== null) {
        await UrlService.updateCountOfUrl(url);
        return res.redirect(url.originalUrl);
      }

      return res.status(statusCode.NOT_FOUND).json({ message: 'Can\'t not found this short url' });
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  },

  async deleteUrl(req, res) {
    const { urlID } = req.params;

    try {
      const url = await UrlService.findUrlByUrlID(urlID);

      if (url === null) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Can\'t found url to delete' });
      }

      if (url.user === null) {
        return res.status(statusCode.FORBIDDEN).json({ message: 'Forbidden to delete this short url' });
      }

      if (url.user.username !== req.session.user.username) {
        return res.status(statusCode.FORBIDDEN).json({ message: 'Forbidden to delete this short url' });
      }

      const result = await UrlService.deleteUrl(urlID);
      return res.status(statusCode.ACCEPTED).json({ message: 'Delete short url succesfully', url });
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  },

  async statistic(req, res) {
    try {
      const { user } = req.session;

      const urls = await UrlService.findAllUrlOfUser(user);
      await clientRedis.set(user.username, JSON.stringify(urls), 'EX', 180);
      return res.status(statusCode.OK).json(urls);
    } catch (err) {
      console.log(err);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  },
};

export default UrlController;
