import User from '../models/user.model.js';

class UserService {
  constructor(model) {
    this.model = model;
  }

  async findUser(email) {
    const user = await this.model.findOne({
      email,
    }).lean();
    return user;
  }

  async createUser(email, password, fullName) {
    const newUser = await this.model({
      email,
      password,
      fullName,
    });
    return newUser.save();
  }

  async updatePassword(email, password) {
    const user = await this.model.updateOne({
      email,
    }, { password });
    return user;
  }
}

export default new UserService(User);
