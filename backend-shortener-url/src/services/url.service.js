import Url from '../models/url.model.js';

const UrlService = {
  async createUrl(urlID, url, user = null) {
    const newShortUrl = await Url.create({
      urlID,
      originalUrl: url,
      user,
    });
    return newShortUrl.save();
  },

  async findUrlByUrlID(urlID) {
    const url = await Url.findOne({
      urlID,
    });
    return url;
  },

  async updateCountOfUrl(url) {
    await Url.updateOne({
      urlID: url.urlID,
    }, { $inc: { count: 1 } });
  },

  async deleteUrl(urlID) {
    const deleteResult = await Url.deleteOne({
      urlID,
    });
    return deleteResult;
  },

  async findAllUrlOfUser(user) {
    const urls = await Url.find({
      'user.username': user.username,
    }, { user: 0 });

    // const urls = await Url.aggregate([
    //   {
    //     $match: {
    //       'user.username': user.username,
    //     },
    //     {
    //       $project: {
    //         urlID: 1,
    //         originalUrl: 1,
    //         count:
    //       }
    //     }
    //   },
    // ]);
    return urls;
  },
};

export default UrlService;
