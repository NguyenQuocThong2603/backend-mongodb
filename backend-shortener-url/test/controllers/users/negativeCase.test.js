import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import statusCode from '../../../src/constants/statusCode.js';
import app from '../../../server.js';
import User from '../../../src/models/user.model.js';

const should = chai.should();
chai.use(chaiHttp);
describe('test POST register user negative case', () => {
  beforeEach('clear database', done => {
    User.deleteMany({}).then();
    done();
  });

  const user = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    fullName: faker.name.fullName(),
  };

  it('should return status code 400 and message about user already exists', done => {
    const newUser = new User({
      username: user.username,
      password: user.password,
      fullName: user.fullName,
    });
    newUser.save((error, result) => {
      if (error) console.log(error);
      else {
        chai.request(app)
          .post('/users/register')
          .send(newUser)
          .end((err, res) => {
            res.status.should.equal(statusCode.BAD_REQUEST);
            res.body.should.be.a('object');
            res.body.should.have.property('message').equal('User already exists');
            done();
          });
      }
    });
  });

  it('should return status code 400 and message about input validation failed', done => {
    const userLostInform = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    chai.request(app)
      .post('/users/register')
      .send(userLostInform)
      .end((err, res) => {
        res.status.should.equal(statusCode.BAD_REQUEST);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Input validation failed');
        done();
      });
  });
});

describe('test POST login user', () => {
  const loginInformation = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
  beforeEach('add user', done => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(loginInformation.password, salt);
    const newUser = new User({
      username: loginInformation.username,
      password: hash,
      fullName: faker.name.fullName(),
    });
    newUser.save().then();
    done();
  });

  it('should return status code 404 and message about username or password is incorrect', done => {
    const loginInformationWrongPassword = {
      username: faker.internet.userName(),
      password: 'fdsfsdfds',
    };
    chai.request(app)
      .post('/users/login')
      .send(loginInformationWrongPassword)
      .end((err, res) => {
        res.status.should.equal(statusCode.NOT_FOUND);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Username or password is incorrect');
        done();
      });
  });

  afterEach('delete user', done => {
    User.deleteMany({}).then();
    done();
  });
});
