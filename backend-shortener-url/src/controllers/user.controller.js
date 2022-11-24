import bcrypt from 'bcrypt';
import statusCode from '../constants/statusCode.js';
import UserService from '../services/user.service.js';

class UserController {
  constructor(service) {
    this.service = service;
  }

  async register(req, res) {
    const { username, password, fullName } = req.body;

    // check if user already exists
    let user = await this.service.findUser(username);
    if (user !== null) {
      return res.status(statusCode.BAD_REQUEST).json({ message: 'User already exists' });
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // create user
    try {
      user = await this.service.createUser(username, hash, fullName);
    } catch (err) {
      if (err._message === 'User validation failed') {
        return res.status(statusCode.BAD_REQUEST).json({ message: 'Input validation failed' });
      }
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }

    const userDTO = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
    };
    return res.status(statusCode.CREATED).json({ message: 'Create user successfully', user: userDTO });
  }

  async login(req, res) {
    const { username, password } = req.body;

    // check username or password is correct or not
    const user = await this.service.findUser(username);
    if (user === null) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Username or password is incorrect' });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (validPassword === false) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Username or password is incorrect' });
    }

    // create session for user
    req.session.user = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      url: user.url,
    };

    return res.status(statusCode.OK).json({ message: 'Login successfully' });
  }
}

export default new UserController(UserService);
