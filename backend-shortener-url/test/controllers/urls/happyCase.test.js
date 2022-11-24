import chai from 'chai';
import chaiHttp from 'chai-http';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import statusCode from '../../../src/constants/statusCode.js';
import app from '../../../server.js';
import Url from '../../../src/models/url.model.js';

const should = chai.should();
chai.use(chaiHttp);

describe('test POST create URL happy case', () => {
  beforeEach('clear database', done => {
    Url.deleteMany({}).then();
    done();
  });

  const url = { url: faker.internet.domainName() };

  it('should return status code 201 and url', done => {
    chai.request(app)
      .post('/urls/')
      .send(url)
      .end((err, res) => {
        res.status.should.equal(statusCode.CREATED);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Create short url successfully');
        res.body.should.have.property('url');
        res.body.url.should.have.property('originalUrl').equal(url.url);
        done();
      });
  });
});

describe('test GET short URL happy case', () => {
  const domainName = 'https://mongoosejs.com/';
  const urlID = nanoid(10);
  beforeEach('add URL', async () => {
    const url = new Url({
      urlID,
      originalUrl: domainName,
    });
    await url.save();
  });

  it('should return status code 200 and redirect', done => {
    Url.findOne({
      originalUrl: domainName,
    }, (error, result) => {
      if (error) console.log(error);
      else {
        chai.request(app)
          .get(`/urls/${result.urlID}`)
          .end((err, res) => {
            res.status.should.equal(statusCode.OK);
            res.redirects.should.include(result.originalUrl);
            done();
          });
      }
    });
  });
  afterEach('clear database', done => {
    Url.deleteMany({}).then();
    done();
  });
});
