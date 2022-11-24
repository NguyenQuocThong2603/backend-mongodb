import User from '../models/user.model.js';

class UserService {
  constructor(model) {
    this.model = model;
  }

  async findUser(username) {
    const user = await this.model.findOne({
      username,
    });
    return user;
  }

  async createUser(username, password, fullName) {
    const newUser = await this.model({
      username,
      password,
      fullName,
    });
    return newUser.save();
  }
}

export default new UserService(User);
