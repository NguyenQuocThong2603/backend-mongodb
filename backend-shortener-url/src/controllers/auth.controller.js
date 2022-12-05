import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import getConfig from '../config/config.js';
import sendResetPasswordEmail from '../config/nodemailer.js';
import clientRedis from '../config/redis.js';
import statusCode from '../constants/statusCode.js';
import UserService from '../services/user.service.js';

const config = getConfig();
const AuthController = {
  async register(req, res) {
    const { email, password, fullName } = req.body;

    // check if user already exists
    let user = await UserService.findUserByEmail(email);
    if (user !== null) {
      return res.status(statusCode.BAD_REQUEST).json({ message: 'User already exists' });
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // create user
    try {
      user = await UserService.createUser(email, hash, fullName);
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
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      // check email or password is correct or not
      const user = await UserService.findUserByEmail(email);
      if (!user) {
        return res.status(statusCode.BAD_REQUEST).json({ message: 'Email or password is incorrect' });
      }

      if (!user.password) {
        return res.status(statusCode.BAD_REQUEST).json({ message: 'Email or password is incorrect' });
      }
      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(statusCode.BAD_REQUEST).json({ message: 'Email or password is incorrect' });
      }

      if (user.isDisable) {
        return res.status(statusCode.UNAUTHORIZED).json({ message: 'This account was disabled' });
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
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  },

  async logout(req, res) {
    if (req.session) {
      await req.session.destroy();
      return res.status(statusCode.OK).json({ message: 'Logout successfully' });
    }
    return res.status(statusCode.BAD_REQUEST).json({ message: 'Unable to logout' });
  },

  async googleLogin(req, res) {
    try {
      const { user } = req;
      await clientRedis.lpush(user.email, `sess:${req.session.id}`);

      await clientRedis.expire(user.email, config.EXPIRED_TIME / 1000);
      return res.json({ message: 'Login successfully', user });
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  },

  async facebookLogin(req, res) {
    try {
      const { user } = req;
      await clientRedis.lpush(user.email, `sess:${req.session.id}`);

      await clientRedis.expire(user.email, config.EXPIRED_TIME / 1000);
      return res.json({ message: 'Login successfully', user });
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  },

  async sendMailResetPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await UserService.findUserByEmail(email);
      if (!user) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Cannot found user' });
      }
      const resetCode = nanoid(10);
      await clientRedis.setex(resetCode, parseInt(config.EXPIRED_TIME_RESET_EMAIL, 10), `${email}`);
      sendResetPasswordEmail(email, resetCode);
      return res.status(statusCode.OK).json({ message: 'Send mail successfully' });
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  },

  async resetPassword(req, res) {
    const { password } = req.body;
    const { code } = req.params;
    try {
      const check = await clientRedis.get(code);

      if (check) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const user = await UserService.updatePassword(check, hashPassword);
        await clientRedis.del(code);
        return res.status(statusCode.OK).json({ message: 'Reset password successfully', user });
      }
      return res.status(statusCode.BAD_REQUEST).json({ message: 'Expired link' });
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  },
};

export default AuthController;
