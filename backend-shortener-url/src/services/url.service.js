import Url from '../models/url.model.js';

class UserService {
  constructor(model) {
    this.model = model;
  }

  async createUrl(urlID, url, user = null) {
    const newShortUrl = await this.model.create({
      urlID,
      originalUrl: url,
      user,
    });
    return newShortUrl.save();
  }

  async findUrl(urlID) {
    const url = await this.model.findOne({
      urlID,
    });
    return url;
  }

  async updateUrl(url) {
    await this.model.updateOne({
      urlID: url.urlID,
    }, { count: url.count += 1 });
  }

  async deleteUrl(urlID) {
    const deleteResult = await this.model.deleteOne({
      urlID,
    });
    return deleteResult;
  }

  async findAllUrlOfUser(user) {
    const urls = await this.model.find({
      'user.username': user.username,
    }, { user: 0 });

    // const urls = await this.model.aggregate([
    //   {
    //     $match: {
    //       'user.username': user.username,
    //     },
    //     {
    //       $project: {
    //         urlID: 1,
    //         originalUrl: 1,
    //         count:
    //       }
    //     }
    //   },
    // ]);
    return urls;
  }
}

export default new UserService(Url);
