import clientRedis from '../config/redis.js';
import statusCode from '../constants/statusCode.js';
import UserService from '../services/user.service.js';

const AdminController = {
  async disableUser(req, res) {
    const { email } = req.query;
    try {
      const isExistKey = await clientRedis.keys(email);
      if (!isExistKey.length) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Not found this email' });
      }
      const result = await UserService.updateIsDisable(email, true);

      if (!result.matchedCount) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Not found this user' });
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
  },
};

export default AdminController;
