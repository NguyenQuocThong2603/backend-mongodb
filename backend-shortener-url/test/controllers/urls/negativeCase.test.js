import chai from 'chai';
import chaiHttp from 'chai-http';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import statusCode from '../../../src/constants/statusCode.js';
import app from '../../../server.js';
import Url from '../../../src/models/url.model.js';

const should = chai.should();
chai.use(chaiHttp);

describe('test POST create URL negative case', () => {
  beforeEach('clear database', done => {
    Url.deleteMany({}).then();
    done();
  });

  it('should return status code 400 and message about invalid request', done => {
    const badRequest = {};
    chai.request(app)
      .post('/urls/')
      .send(badRequest)
      .end((err, res) => {
        res.status.should.equal(statusCode.BAD_REQUEST);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Invalid request');
        done();
      });
  });
});

describe('test GET short URL negative case', () => {
  const domainName = 'https://mongoosejs.com/';
  const urlID = nanoid(10);
  beforeEach('add URL', async () => {
    const url = new Url({
      urlID,
      originalUrl: domainName,
    });
    await url.save();
  });

  it('should return status code 404 and message about can\'t found this short url', done => {
    const fakeUrlID = nanoid(10);
    chai.request(app)
      .get(`/urls/${fakeUrlID}`)
      .end((err, res) => {
        res.status.should.equal(statusCode.NOT_FOUND);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Can\'t not found this short url');
        done();
      });
  });
  afterEach('clear database', done => {
    Url.deleteMany({}).then();
    done();
  });
});
