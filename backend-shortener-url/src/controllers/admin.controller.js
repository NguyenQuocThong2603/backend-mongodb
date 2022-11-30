import clientRedis from '../config/redis.js';
import statusCode from '../constants/statusCode.js';
import UserService from '../services/user.service.js';

class AdminController {
  constructor(service) {
    this.service = service;
  }

  async disableUser(req, res) {
    const { username } = req.params;
    try {
      const keysOfSession = await clientRedis.lrange(username, 0, -1);
      clientRedis.del(username);
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
