var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var Channel = require('../../src/model/Channel');
var mockData = require('../fixtures/channels');
var mongoose = require('mongoose');
var baseUrl = '/api/channels';
var helper = require('../helper');
var pRequest = helper.promisifyRequest(baseUrl);

describe(`${baseUrl}`, () => {
  after((done) => {
    Channel.remove(done);
  });

  context(`POST`, () => {
    describe(`Given there are no channels`, () => {
      after((done) => {
        Channel.remove(done);
      });

      describe(`When a request is made to create a new channel`, () => {
        var response = {};
        var channel = mockData[0];

        before((done) => {
          pRequest({ data: channel }).then(res => {
              response = res;
              done();
            });
        });

        it(`should create one channel`, () => {
          helper.assert(response.body, channel);
        });

        it(`should have a 201 status code`, () => {
          expect(response.statusCode).to.equal(201);
        });

        it(`should have no errors`, () => {
          expect(response.error).to.be.false;
        });

      });

      describe(`When a request is made to create 4 new channels`, () => {
        var response = {};
        var channels = mockData;

        before((done) => {
          pRequest({ data: channels }).then(res => {
              response = res;
              done();
            });
        });

        it(`should create 4 channels`, () => {
          helper.assert(response.body, channels);
        });

        it(`should have a 201 status code`, () => {
          expect(response.statusCode).to.equal(201);
        });

        it(`should have no errors`, () => {
          expect(response.error).to.be.false;
        });
      });

      describe(`And the data to be posted is invalid`, () => {
        describe(`When a request is made to create a channel`, () => {
          var response = {};

          before((done) => {
            pRequest({}).then(function(res) {
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
  });

  context('GET', () => {

    describe(`Given there are 4 Channels`, () => {
      var clonedMockData = _.cloneDeep(mockData);

      before((done) => {
        Channel.create(clonedMockData, done);
      });

      after((done) => {
        Channel.remove(done);
      });

      describe(`When the 4 channels are requested`, () => {
        var response;

        before((done) => {
          pRequest({ method: `get` }).then(res => {
            response = res;
            done();
          });
        });

        it(`should return 4 channels`, () => {
          helper.assert(response.body, clonedMockData);
        });

        it(`should have a 200 status code`, () => {
          expect(response.statusCode).to.equal(200);
        });

        it(`should have no errors`, () => {
          expect(response.error).to.be.false;
        });
      });

      describe('And there is a query to find a channel with name `Channel C`', () => {
        var query = '{"name":"Channel C"}';
        var expected = clonedMockData[2];

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

      describe('And there is a query to find a channel with name `Channel B`', () => {
        var query = { 'name':'Channel B' };
        var expected = clonedMockData[1];

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

    describe(`Given there is a channel`, () => {
        var channelId = mongoose.Types.ObjectId();
        var channel = _.cloneDeep(mockData[1]);
        channel._id = channelId;

        before((done) => {
          Channel.create(channel, done);
        });

        after((done) => {
          Channel.remove(channel, done);
        });

        describe(`When the channel is requested`, () => {
          var response;

          before((done) => {
            pRequest({ method: 'get', path: channelId }).then(res => {
              response = res;
              done();
            });
          });

          it(`should return a channel`, () => {
            channel.id = channel._id.toString();
            delete channel._id;

            helper.assert(response.body, channel);
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
          pRequest({ method: 'get' }).then(function(res) {
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
    describe(`Given there is a channel`, () => {
      var channelId = mongoose.Types.ObjectId();
      var channel =_.cloneDeep(mockData[2]);
      channel._id = channelId;

      before((done) => {
        Channel.create(channel, done);
      });

      after((done) => {
        Channel.remove(channel, done);
      });

      describe(`When a request is made to update the channel with a new name`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'put', path: channelId, data: { show: 'A new show' } }).then(res => {
            response = res;
            done();
          });
          // TODO: GET request to confirm that items updated
        });

        it('should update the specified channel and return an empty object', () => {
          expect(response.body).to.eql({});
        });

        it(`200`, () => {
          expect(response.statusCode).to.equal(200);
        });

      });

      describe(`When a request is made to update the channel with an invalid query`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'put', path: channelId, data: { name: {} } }).then(res => {
            response = res;
            done();
          });
        });

        it('should update the specified channel and return an empty object', () => {
          // TODO
        });

        it(`400`, () => {
          expect(response.statusCode).to.equal(400);
        });
      });
    });

    describe(`Given a channel does not exist`, () => {
      var nonExistentChannelId = mongoose.Types.ObjectId();

      describe(`When a request is made to updade the channel`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'put', path: nonExistentChannelId }).then(res => {
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

  context(`DELETE`, () => {
    describe(`Given there is a channel`, () => {
      var channelId = mongoose.Types.ObjectId();
      var channel =_.cloneDeep(mockData[0]);
      channel._id = channelId;

      before((done) => {
        Channel.create(channel, done);
      });

      after((done) => {
        Channel.remove(channel, done);
      });

      describe(`When a request is made to delete the channel`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'del', path: channelId }).then(res => {
            response = res;
            done();
          });
        });

        it('should delete the specified channel and return an empty object', () => {
          expect(response.body).to.eql({});
        });

        it(`204`, () => {
          expect(response.statusCode).to.equal(204);
        });

      });

      describe(`When a request is made to delete the channel with an invalid query`, () => {
        var response;
        var invalidChannel;

        before((done) => {
          // invalidChannel = _.cloneDeep(mockData[0]);
          // invalidChannel.code = '';
          pRequest({ method: 'del', path: 'channelId' }).then(res => {
            response = res;
            done();
          });
        });

        it('should return an error message', () => {
          // TODO: expect(response.body).to.eql({});
        });

        it(`400`, () => {
          expect(response.statusCode).to.equal(400);
        });
      });
    });

    describe(`Given a channel does not exist`, () => {
      var nonExistentChannelId = mongoose.Types.ObjectId();

      describe(`When a request is made to delete the channel`, () => {
        var response;

        before((done) => {
          pRequest({ method: 'del', path: nonExistentChannelId }).then(function(res) {
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
