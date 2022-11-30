import bcrypt from 'bcrypt';
import getConfig from '../config/config.js';
import clientRedis from '../config/redis.js';
import statusCode from '../constants/statusCode.js';
import UserService from '../services/user.service.js';

const config = getConfig();
class AuthController {
  constructor(service) {
    this.service = service;
  }

  async register(req, res) {
    const { email, password, fullName } = req.body;

    // check if user already exists
    let user = await this.service.findUser(email);
    if (user !== null) {
      return res.status(statusCode.BAD_REQUEST).json({ message: 'User already exists' });
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // create user
    try {
      user = await this.service.createUser(email, hash, fullName);
    } catch (err) {
      if (err._message === 'User validation failed') {
        return res.status(statusCode.BAD_REQUEST).json({ message: 'Input validation failed' });
      }
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }

    const userDTO = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    };
    return res.status(statusCode.CREATED).json({ message: 'Create user successfully', user: userDTO });
  }

  async login(req, res) {
    const { email, password } = req.body;

    // check email or password is correct or not
    const user = await this.service.findUser(email);
    if (user === null) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Email or password is incorrect' });
    }

    if (user.password) {
      const validPassword = bcrypt.compareSync(password, user.password);

      if (validPassword === false) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Email or password is incorrect' });
      }
    } else {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Email or password is incorrect' });
    }

    // create session for user
    req.session.user = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    await clientRedis.lpush(user.email, `sess:${req.session.id}`);

    await clientRedis.expire(email, config.EXPIRED_TIME / 1000);

    return res.status(statusCode.OK).json({ message: 'Login successfully' });
  }

  async logout(req, res) {
    if (req.session) {
      await req.session.destroy();
      return res.status(statusCode.OK).json({ message: 'Logout successfully' });
    }
    return res.status(statusCode.BAD_REQUEST).json({ message: 'Unable to logout' });
  }
}

export default new AuthController(UserService);
