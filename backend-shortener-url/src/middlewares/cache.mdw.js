import clientRedis from '../config/redis.js';
import statusCode from '../constants/statusCode.js';

async function cacheUrls(req, res, next) {
  let urls;
  const { user } = req.session;
  try {
    const cacheResults = await clientRedis.get(user.username);
    if (cacheResults) {
      urls = JSON.parse(cacheResults);
      res.send(urls);
    } else {
      next();
    }
  } catch (err) {
    res.status(statusCode.NOT_FOUND).json({ message: 'Data unavailable' });
  }
}

export default cacheUrls;
