import clientRedis from '../config/redis.js';
import statusCode from '../constants/statusCode.js';
import UserService from '../services/user.service.js';

class AdminController {
  constructor(service) {
    this.service = service;
  }

  async disableUser(req, res) {
    const { email } = req.query;
    try {
      const isExistKey = await clientRedis.keys(email);
      if (isExistKey.length === 0) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Not found this email' });
      }
      const keysOfSession = await clientRedis.lrange(email, 0, -1);
      clientRedis.del(email);
      keysOfSession.forEach(key => {
        clientRedis.del(key);
      });
      return res.status(statusCode.OK).json({ message: 'Disable user successfully' });
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: err });
    }
  }
}

export default new AdminController(UserService);
