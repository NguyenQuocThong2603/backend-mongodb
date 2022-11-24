import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import statusCode from '../../../src/constants/statusCode.js';
import app from '../../../server.js';
import User from '../../../src/models/user.model.js';

const should = chai.should();
chai.use(chaiHttp);

describe('test POST register user happy cases', () => {
  beforeEach('clear database', done => {
    User.deleteMany({}).then();
    done();
  });

  const user = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    fullName: faker.name.fullName(),
  };

  it('should return status code 201 and user', done => {
    chai.request(app)
      .post('/users/register')
      .send(user)
      .end((err, res) => {
        res.status.should.equal(statusCode.CREATED);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Create user successfully');
        res.body.should.have.property('user');
        res.body.user.should.have.property('username').equal(user.username);
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

  it('should return status code 200', done => {
    chai.request(app)
      .post('/users/login')
      .send(loginInformation)
      .end((err, res) => {
        res.status.should.equal(statusCode.OK);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Login successfully');
        done();
      });
  });

  afterEach('delete user', done => {
    User.deleteMany({}).then();
    done();
  });
});
