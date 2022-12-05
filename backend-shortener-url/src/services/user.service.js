import User from '../models/user.model.js';

const UserService = {
  async findUserByEmail(email) {
    const user = await User.findOne({
      email,
    }).lean();
    return user;
  },

  async createUser(email, password, fullName) {
    const newUser = await User({
      email,
      password,
      fullName,
    });
    return newUser.save();
  },

  async updatePassword(email, password) {
    const result = await User.updateOne({
      email,
    }, { password });
    return result;
  },

  async updateIsDisable(email, isDisable) {
    const result = await User.updateOne({
      email,
    }, { isDisable });
    return result;
  },
};

export default UserService;
