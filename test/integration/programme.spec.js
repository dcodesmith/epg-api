'use strict';
var chai = require('chai');
var _ = require('lodash');
var mongoose = require('mongoose');
var expect = chai.expect;
var Programme = require('../../src/model/Programme');
var helper = require('../helper');
var Channel = require('../../src/model/Channel');
var channelMockData = _.cloneDeep(require('../fixtures/channels'));
var programmeMockData = require('../fixtures/programmes');
var baseUrl = '/api/programmes';
var assertRequest = helper.assertRequest(baseUrl);
var request = require('supertest')(require('../../src/server'));
var pRequest = helper.promisifyRequest(baseUrl);
var clonedMockData = programmeMockData.map(data => {
  delete data.channelCode;
  data.channel = mongoose.Types.ObjectId();
  data.date = new Date(data.date).toISOString();
  return data;
});

describe(`${baseUrl}`, () => {

  after((done) => {
    Programme.remove(done);
  });

  context(`IMPORT CSV`, () => {

      describe('When a valid post request is made', () => {

        beforeEach((done) => {
          Channel.create(channelMockData, done);
        });

        afterEach((done) => {
          Channel.remove(done);
        });

        it('should create one programme, return a 201 response & have no errors', (done) => {

          request.post(`${baseUrl}/import`)
            .attach('programme', './test/fixtures/valid.csv')
            .expect(201)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              done();
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

          request.post(`${baseUrl}/import`)
            .attach('programme',  './test/fixtures/invalid.csv')
            .expect(400)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              done();
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

          request.post(`${baseUrl}/import`)
            .expect(400)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              done();
            });
        });
      });
  });

  context('POST', () => {

    afterEach((done) => {
      Programme.remove(done);
    });

    it('should create one channel, return a 201 response & have no errors', (done) => {
      var options;
      var programme = _.cloneDeep(programmeMockData[0]);
      programme.channel = mongoose.Types.ObjectId();
      options = { data: programme, statusCode: 201 };

      assertRequest(options, done);
    });

    describe('When the post request has a missing value in payload', () => {
      var invalidProgramme = {};

      beforeEach(() => {
        invalidProgramme = _.cloneDeep(clonedMockData[4]);
        invalidProgramme.channel = '';
      });

      it('should not create a programme, return a 400 response & an error', (done) => {
        var options = { data: invalidProgramme, statusCode: 400 };
        assertRequest(options, done);
      });
    });
  });

  context('GET', () => {
    describe(`Given there are 4 programmes`, () => {
      before((done) => {
        Programme.create(clonedMockData, done);
      });

      after((done) => {
        Programme.remove(done);
      });

      describe(`When the programmes are requested`, () => {
        var response;

        before((done) => {
          pRequest({ method: `get` }).then(res => {
            response = res;
            done();
          });
        });

        it(`should return programmes`, () => {
          helper.assert(response.body, clonedMockData);
        });

        it(`should have a 200 status code`, () => {
          expect(response.statusCode).to.equal(200);
        });

        it(`should have no errors`, () => {
          expect(response.error).to.be.false;
        });
      });

      describe('And there is a query to find a programmes with show `News`', () => {
        var query = '{"show":"News"}';
        var expected = clonedMockData[0];

        // before(()=>{
        //   expected.date = new Date(expected.date).toISOString();
        //   expected.channel = String(expected.channel);
        // });

        describe(`When the request is made`, () => {
          var response;

          before((done) => {
            pRequest({ method: `get`, query: { find: query } }).then(res => {
              response = res;
              done();
            });
          });

          it(`should return 1 channel`, () => {
            helper.assert(response.body, [expected]);
          });

          it(`should have a 200 status code`, () => {
            expect(response.statusCode).to.equal(200);
          });

          it(`should have no errors`, () => {
            expect(response.error).to.be.false;
          });
        });
      });

      describe('And there is a query to find a channel with show `Man on Fire`', () => {
        var query = {'show':'Man on Fire'};
        var expected = clonedMockData[1];

        describe(`When the request is made`, () => {
          var response;

          before((done) => {
            pRequest({ method: `get`, query: {find: query} }).then(res => {
              response = res;
              done();
            });
          });

          it(`should return 1 channel`, () => {
            helper.assert(response.body, [expected]);
          });

          it(`should have a 200 status code`, () => {
            expect(response.statusCode).to.equal(200);
          });

          it(`should have no errors`, () => {
            expect(response.error).to.be.false;
          });
        });
      });

      describe(`And an invalid query`, () => {

        describe(`When the 4 channels are requested`, () => {
          var response;

          before((done) => {
            // TODO: Do more
            pRequest({ method: 'get', query: 'sort=-' }).then(res => {
              response = res;
              done();
            });
          });

          it(`should have error messages matching the invalid fields`, () => {});

          it(`400`, () => {
            expect(response.statusCode).to.equal(400);
          });

        });
      });

    });

    describe(`Given there is a programmes`, () => {
        var programmeId = mongoose.Types.ObjectId();
        var programme = _.cloneDeep(clonedMockData[1]);
        programme.channel = mongoose.Types.ObjectId();
        programme._id = programmeId;

        before((done) => {
          Programme.create(programme, done);
        });

        after((done) => {
          Programme.remove(programme, done);
        });

        describe(`When the programme is requested`, () => {
          var response;

          before((done) => {
            pRequest({ method: 'get', path: programmeId }).then(res => {
              response = res;
              done();
            });
          });

          it(`should return a programme`, () => {
            delete programme._id;
            helper.assert(response.body, programme);
          });

          it(`should have a 200 status code`, () => {
            expect(response.statusCode).to.equal(200);
          });

          it(`should have no errors`, () => {
            expect(response.error).to.be.false;
          });
        });

        describe(`And an invalid channel ID`, () => {
          var invalidId = 'invalidID';

          describe(`When a request is made`, () => {
              var response;

              before((done) => {
                pRequest({ method: 'get', path: invalidId }).then(res => {
                  response = res;
                  done();
                });
              });

              it(`should have error messages matching the invalid fields`, () => {});

              it(`400`, () => {
                expect(response.statusCode).to.equal(400);
              });
            });
        });
      });

      // Given that a channel {id} does not exist
      //   When the channel is updated
      //     it should return a 404 not found status code;

    describe(`Given channels do not exist`, () => {

      before((done) => {
        Channel.remove(done);
      });

      describe(`When a request is made to get the channel`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'get' }).then(res => {
            response = res;
            done();
          });
        });

        it(`should return 0 channels`, () => {
          expect(response.body.length).to.equal(0);
        });

        it(`200`, () => {
          expect(response.statusCode).to.equal(200);
        });
      });
    });

    describe(`Given a channel does not exist`, () => {
      var nonExistentChannelId = mongoose.Types.ObjectId();

      beforeEach((done) => {
        Channel.remove({}, done);
      });

      describe(`When a request is made to get the channel`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'get', path: nonExistentChannelId }).then(res => {
            response = res;
            done();
          });
        });

        it(`404`, () => {
          expect(response.statusCode).to.equal(404);
        });
      });
    });
  });

  context('UPDATE', () => {
    describe(`Given there is a programme`, () => {
      var programmeId = mongoose.Types.ObjectId();
      var programme =_.cloneDeep(clonedMockData[2]);
      programme._id = programmeId;
      programme.channel = mongoose.Types.ObjectId();

      before((done) => {
        Programme.create(programme, done);
      });

      after((done) => {
        Programme.remove(programme, done);
      });

      describe(`When a request is made to update the programme with a new name`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'put', path: programmeId, data: { show: 'A new show' } }).then(res => {
            response = res;
            done();
          });
          // TODO: GET request to confirm that items updated
        });

        it('should update the specified programme and return an empty object', () => {
          expect(response.body).to.eql({});
        });

        it(`200`, () => {
          expect(response.statusCode).to.equal(200);
        });

      });

      describe(`When a request is made to update the programme with an invalid query`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'put', path: programmeId, data: { show: {} } }).then(res => {
            response = res;
            done();
          });
        });

        it('should update the specified channel and return an empty object', () => {
          // TODO: match error message
        });

        it(`400`, () => {
          expect(response.statusCode).to.equal(400);
        });
      });
    });

    describe(`Given a programmeId does not exist`, () => {
      var nonExistentProgrammeIdId = mongoose.Types.ObjectId();

      describe(`When a request is made to updade the channel`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'put', path: nonExistentProgrammeIdId }).then(res => {
            response = res;
            done();
          });
        });

        it(`404`, () => {
          expect(response.statusCode).to.equal(404);
        });
      });
    });
  });

  context('DELETE', () => {
    describe(`Given there is a programme`, () => {
      var programmeId = mongoose.Types.ObjectId();
      var programme =_.cloneDeep(clonedMockData[0]);
      programme._id = programmeId;
      programme.channel = mongoose.Types.ObjectId();

      before((done) => {
        Programme.create(programme, done);
      });

      after((done) => {
        Programme.remove(programme, done);
      });

      describe(`When a request is made to delete the programme`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'del', path: programmeId }).then(res => {
            response = res;
            done();
          });
        });

        it('should delete the specified programme and return an empty object', () => {
          // TODO: expect(response.body).to.eql({});
        });

        it(`204`, () => {
          expect(response.statusCode).to.equal(204);
        });
      });

      describe(`When a request is made to delete the programme with an invalid query`, () => {
        var response;
        var invalidProgramme;

        before((done) => {
          pRequest({ method: 'del', path: 'channelId' }).then(res => {
            response = res;
            done();
          });
        });

        it('should return an error message', () => {
          // TODO: error message
        });

        it(`400`, () => {
          expect(response.statusCode).to.equal(400);
        });
      });
    });

    describe(`Given a programme does not exist`, () => {
      var nonExistentProgrammeId = mongoose.Types.ObjectId();

      describe(`When a request is made to delete the programme`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'del', path: nonExistentProgrammeId }).then(res => {
            response = res;
            done();
          });
        });

        it(`204`, () => {
          expect(response.statusCode).to.equal(204);
        });
      });
    });
  });

});
