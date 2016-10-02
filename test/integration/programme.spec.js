import { expect } from 'chai';
import { cloneDeep } from 'lodash';
import supertest from 'supertest';
import mongoose from 'mongoose';
import HTTPStatus from 'http-status';
import Programme from '../../src/model/Programme';
import * as helper from '../helper';
import Channel from '../../src/model/Channel';
import channelData from '../fixtures/channels';
import programmeMockData from '../fixtures/programmes';
import app from '../../src/server';

const baseUrl = '/api/programmes';
const assertRequest = helper.assertRequest(baseUrl); // eslint-disable-line no-redeclare
const request = helper.promisifyRequest(baseUrl);
const channelMockData = cloneDeep(channelData);
const clonedMockData = programmeMockData.map((data) => {
  const clonedData = data;

  delete clonedData.channelCode;

  clonedData.channel = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
  clonedData.date = new Date(data.date).toISOString();

  return clonedData;
});

describe(`${baseUrl}`, () => {
  after((done) => {
    Programme.remove(done);
  });

  context('IMPORT CSV', () => {
    describe('When a valid post request is made', () => {
      beforeEach((done) => {
        Channel.create(channelMockData, done);
      });

      afterEach((done) => {
        Channel.remove(done);
      });

      it('should create one programme, return a 201 response & have no errors', (done) => {
        supertest(app).post(`${baseUrl}/import`)
          .attach('programme', './test/fixtures/valid.csv')
          .expect(HTTPStatus.CREATED)
          .end((err) => {
            if (err) {
              return done(err);
            }
            return done();
          });
      });
    });

    describe('POST invalid csv', () => {
      beforeEach((done) => {
        Channel.create(channelMockData, done);
      });

      afterEach((done) => {
        Channel.remove(done);
      });

      it('should NOT create a programme, return a 400 response with errors', (done) => {
        supertest(app).post(`${baseUrl}/import`)
          .attach('programme', './test/fixtures/invalid.csv')
          .expect(HTTPStatus.BAD_REQUEST)
          .end((err) => {
            if (err) {
              return done(err);
            }
            return done();
          });
      });
    });

    describe('POST no csv', () => {
      beforeEach((done) => {
        Channel.create(channelMockData, done);
      });

      afterEach((done) => {
        Channel.remove(done);
      });

      it('should NOT create a programme, return a 404 response with errors', (done) => {
        supertest(app).post(`${baseUrl}/import`)
          .expect(HTTPStatus.BAD_REQUEST)
          .end((err) => {
            if (err) {
              return done(err);
            }
            return done();
          });
      });
    });
  });

  context('POST', () => {
    afterEach((done) => {
      Programme.remove(done);
    });

    it('should create one channel, return a 201 response & have no errors', (done) => {
      const programme = cloneDeep(programmeMockData[0]);
      let options = {};
      programme.channel = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      options = { data: programme, statusCode: HTTPStatus.CREATED };

      assertRequest(options, done);
    });

    describe('When the post request has a missing value in payload', () => {
      let invalidProgramme = {};

      beforeEach(() => {
        invalidProgramme = cloneDeep(clonedMockData[4]);
        invalidProgramme.channel = '';
      });

      it('should not create a programme, return a 400 response & an error', (done) => {
        const options = { data: invalidProgramme, statusCode: HTTPStatus.NOT_FOUND };
        assertRequest(options, done);
      });
    });
  });

  context('GET', () => {
    describe('Given there are 4 programmes', () => {
      before((done) => {
        Programme.create(clonedMockData, done);
      });

      after((done) => {
        Programme.remove(done);
      });

      describe('When the programmes are requested', () => {
        let response;

        before((done) => {
          request({ method: 'get' }).then((res) => {
            response = res;
            done();
          });
        });

        it('should return programmes', () => {
          helper.assert(response.body, clonedMockData);
        });

        it('should have a 200 status code', () => {
          expect(response.statusCode).to.equal(HTTPStatus.OK);
        });

        it('should have no errors', () => {
          expect(response.error).to.be.false;
        });
      });

      describe('And there is a query to find a programmes with show `News`', () => {
        const query = '{"show":"News"}';
        const expected = clonedMockData[0];

        // before(()=>{
        //   expected.date = new Date(expected.date).toISOString();
        //   expected.channel = String(expected.channel);
        // });

        describe('When the request is made', () => {
          let response;

          before((done) => {
            request({ method: 'get', query: { find: query } }).then((res) => {
              response = res;
              done();
            });
          });

          it('should return 1 programme', () => {
            helper.assert(response.body, [expected]);
          });

          it('should have a 200 status code', () => {
            expect(response.statusCode).to.equal(HTTPStatus.OK);
          });

          it('should have no errors', () => {
            expect(response.error).to.be.false;
          });
        });
      });

      describe('And there is a query to find a programme with show `Man on Fire`', () => {
        const query = { show: 'Man on Fire' };
        const expected = clonedMockData[1];

        describe('When the request is made', () => {
          let response;

          before((done) => {
            request({ method: 'get', query: { find: query } }).then((res) => {
              response = res;
              done();
            });
          });

          it('should return 1 programme', () => {
            helper.assert(response.body, [expected]);
          });

          it('should have a 200 status code', () => {
            expect(response.statusCode).to.equal(HTTPStatus.OK);
          });

          it('should have no errors', () => {
            expect(response.error).to.be.false;
          });
        });
      });

      describe('And an invalid query', () => {
        describe('When the 4 programmes are requested', () => {
          let response;

          before((done) => {
            // TODO: Do more
            request({ method: 'get', query: 'sort=-' }).then((res) => {
              response = res;
              done();
            });
          });

          it('should have error messages matching the invalid fields', () => {});

          it('400', () => {
            expect(response.statusCode).to.equal(HTTPStatus.BAD_REQUEST);
          });
        });
      });
    });

    describe('Given there is a programmes', () => {
      const programmeId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      const programme = cloneDeep(clonedMockData[1]);
      programme.channel = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      programme._id = programmeId;

      before((done) => {
        Programme.create(programme, done);
      });

      after((done) => {
        Programme.remove(programme, done);
      });

      describe('When the programme is requested', () => {
        let response;

        before((done) => {
          request({ method: 'get', path: programmeId }).then((res) => {
            response = res;
            done();
          });
        });

        it('should return a programme', () => {
          delete programme._id;
          helper.assert(response.body, programme);
        });

        it('should have a 200 status code', () => {
          expect(response.statusCode).to.equal(HTTPStatus.OK);
        });

        it('should have no errors', () => {
          expect(response.error).to.be.false;
        });
      });

      describe('And an invalid channel ID', () => {
        const invalidId = 'invalidID';

        describe('When a request is made', () => {
          let response = {};

          before((done) => {
            request({ method: 'get', path: invalidId }).then((res) => {
              response = res;
              done();
            });
          });

          it('should have error messages matching the invalid fields', () => {});

          it('400', () => {
            expect(response.statusCode).to.equal(HTTPStatus.BAD_REQUEST);
          });
        });
      });
    });

    // Given that a channel {id} does not exist
    //   When the channel is updated
    //     it should return a 404 not found status code;

    describe('Given channels do not exist', () => {
      before((done) => {
        Channel.remove(done);
      });

      describe('When a request is made to get the channel', () => {
        let response = {};

        before((done) => {
          request({ method: 'get' }).then((res) => {
            response = res;
            done();
          });
        });

        it('should return 0 channels', () => {
          expect(response.body.length).to.equal(0);
        });

        it('200', () => {
          expect(response.statusCode).to.equal(HTTPStatus.OK);
        });
      });
    });

    describe('Given a channel does not exist', () => {
      const nonExistentChannelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap

      beforeEach((done) => {
        Channel.remove({}, done);
      });

      describe('When a request is made to get the channel', () => {
        let response = {};

        before((done) => {
          request({ method: 'get', path: nonExistentChannelId }).then((res) => {
            response = res;
            done();
          });
        });

        it('404', () => {
          expect(response.statusCode).to.equal(HTTPStatus.NOT_FOUND);
        });
      });
    });
  });

  context('UPDATE', () => {
    describe('Given there is a programme', () => {
      const programmeId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      const programme = cloneDeep(clonedMockData[2]);
      programme._id = programmeId;
      programme.channel = mongoose.Types.ObjectId(); // eslint-disable-line new-cap

      before((done) => {
        Programme.create(programme, done);
      });

      after((done) => {
        Programme.remove(programme, done);
      });

      describe('When a request is made to update the programme with a new name', () => {
        let response;

        before((done) => {
          request({ method: 'put', path: programmeId, data: { show: 'A new show' } }).then((res) => {
            response = res;
            done();
          });
          // TODO: GET request to confirm that items updated
        });

        it('should update the specified programme and return an empty object', () => {
          expect(response.body).to.eql({});
        });

        it('200', () => {
          expect(response.statusCode).to.equal(HTTPStatus.OK);
        });
      });

      describe('When a request is made to update the programme with an invalid query', () => {
        let response;

        before((done) => {
          request({ method: 'put', path: programmeId, data: { show: {} } }).then((res) => {
            response = res;
            done();
          });
        });

        it('should update the specified channel and return an empty object', () => {
          // TODO: match error message
        });

        it('400', () => {
          expect(response.statusCode).to.equal(HTTPStatus.BAD_REQUEST);
        });
      });
    });

    describe('Given a programmeId does not exist', () => {
      const nonExistentProgrammeIdId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap

      describe('When a request is made to updade the channel', () => {
        let response;

        before((done) => {
          request({ method: 'put', path: nonExistentProgrammeIdId }).then((res) => {
            response = res;
            done();
          });
        });

        it('404', () => {
          expect(response.statusCode).to.equal(HTTPStatus.NOT_FOUND);
        });
      });
    });
  });

  context('DELETE', () => {
    describe('Given there is a programme', () => {
      const programmeId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      const programme = cloneDeep(clonedMockData[0]);
      programme._id = programmeId;
      programme.channel = mongoose.Types.ObjectId(); // eslint-disable-line new-cap

      before((done) => {
        Programme.create(programme, done);
      });

      after((done) => {
        Programme.remove(programme, done);
      });

      describe('When a request is made to delete the programme', () => {
        let response;

        before((done) => {
          request({ method: 'del', path: programmeId }).then((res) => {
            response = res;
            done();
          });
        });

        it('should delete the specified programme and return an empty object', () => {
          // TODO: expect(response.body).to.eql({});
        });

        it('204', () => {
          expect(response.statusCode).to.equal(HTTPStatus.NO_CONTENT);
        });
      });

      describe('When a request is made to delete the programme with an invalid query', () => {
        let response = {};

        before((done) => {
          request({ method: 'del', path: 'channelId' }).then((res) => {
            response = res;
            done();
          });
        });

        it('should return an error message', () => {
          // TODO: error message
        });

        it('400', () => {
          expect(response.statusCode).to.equal(HTTPStatus.BAD_REQUEST);
        });
      });
    });

    describe('Given a programme does not exist', () => {
      const nonExistentProgrammeId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap

      describe('When a request is made to delete the programme', () => {
        let response;

        before((done) => {
          request({ method: 'del', path: nonExistentProgrammeId }).then((res) => {
            response = res;
            done();
          });
        });

        it('204', () => {
          expect(response.statusCode).to.equal(HTTPStatus.NO_CONTENT);
        });
      });
    });
  });
});
