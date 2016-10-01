const chai = require('chai');
const _ = require('lodash');
const Channel = require('../../src/model/Channel');
const mockData = require('../fixtures/channels');
const mongoose = require('mongoose');
const helper = require('../helper');

const expect = chai.expect;
const baseUrl = '/api/channels';
const pRequest = helper.promisifyRequest(baseUrl);

describe(`${baseUrl}`, () => {
  after((done) => {
    Channel.remove(done);
  });

  context('POST', () => {
    describe('Given there are no channels', () => {
      after((done) => {
        Channel.remove(done);
      });

      describe('When a request is made to create a new channel', () => {
        const channel = mockData[0];
        let response = {};

        before((done) => {
          pRequest({ data: channel }).then((res) => {
            response = res;
            done();
          });
        });

        it('should create one channel', () => {
          helper.assert(response.body, channel);
        });

        it('should have a 201 status code', () => {
          expect(response.statusCode).to.equal(201);
        });

        it('should have no errors', () => {
          expect(response.error).to.be.false;
        });
      });

      describe('When a request is made to create 4 new channels', () => {
        const channels = mockData;
        let response = {};

        before((done) => {
          pRequest({ data: channels }).then((res) => {
            response = res;
            done();
          });
        });

        it('should create 4 channels', () => {
          helper.assert(response.body, channels);
        });

        it('should have a 201 status code', () => {
          expect(response.statusCode).to.equal(201);
        });

        it('should have no errors', () => {
          expect(response.error).to.be.false;
        });
      });

      describe('And the data to be posted is invalid', () => {
        describe('When a request is made to create a channel', () => {
          let response = {};

          before((done) => {
            pRequest({}).then((res) => {
              response = res;
              done();
            });
          });

          it('should have error messages matching the invalid fields', () => {
            // TODO
          });

          it('400', () => {
            expect(response.statusCode).to.equal(400);
          });
        });
      });
    });
  });

  context('GET', () => {
    describe('Given there are 4 Channels', () => {
      const clonedMockData = _.cloneDeep(mockData);

      before((done) => {
        Channel.create(clonedMockData, done);
      });

      after((done) => {
        Channel.remove(done);
      });

      describe('When the 4 channels are requested', () => {
        let response;

        before((done) => {
          pRequest({ method: 'get' }).then((res) => {
            response = res;
            done();
          });
        });

        it('should return 4 channels', () => {
          helper.assert(response.body, clonedMockData);
        });

        it('should have a 200 status code', () => {
          expect(response.statusCode).to.equal(200);
        });

        it('should have no errors', () => {
          expect(response.error).to.be.false;
        });
      });

      describe('And there is a query to find a channel with name `Channel C`', () => {
        const query = '{"name":"Channel C"}';
        const expected = clonedMockData[2];

        describe('When the request is made', () => {
          let response;

          before((done) => {
            pRequest({ method: 'get', query: { find: query } }).then((res) => {
              response = res;
              done();
            });
          });

          it('should return 1 channel', () => {
            helper.assert(response.body, [expected]);
          });

          it('should have a 200 status code', () => {
            expect(response.statusCode).to.equal(200);
          });

          it('should have no errors', () => {
            expect(response.error).to.be.false;
          });
        });
      });

      describe('And there is a query to find a channel with name `Channel B`', () => {
        const query = { name: 'Channel B' };
        const expected = clonedMockData[1];

        describe('When the request is made', () => {
          let response;

          before((done) => {
            pRequest({ method: 'get', query: { find: query } }).then((res) => {
              response = res;
              done();
            });
          });

          it('should return 1 channel', () => {
            helper.assert(response.body, [expected]);
          });

          it('should have a 200 status code', () => {
            expect(response.statusCode).to.equal(200);
          });

          it('should have no errors', () => {
            expect(response.error).to.be.false;
          });
        });
      });

      describe('And an invalid query', () => {
        describe('When the 4 channels are requested', () => {
          let response;

          before((done) => {
            // TODO: Do more
            pRequest({ method: 'get', query: 'sort=-' }).then((res) => {
              response = res;
              done();
            });
          });

          it('should have error messages matching the invalid fields', () => {});

          it('400', () => {
            expect(response.statusCode).to.equal(400);
          });
        });
      });
    });

    describe('Given there is a channel', () => {
      const channelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      const channel = _.cloneDeep(mockData[1]);
      channel._id = channelId;

      before((done) => {
        Channel.create(channel, done);
      });

      after((done) => {
        Channel.remove(channel, done);
      });

      describe('When the channel is requested', () => {
        let response;

        before((done) => {
          pRequest({ method: 'get', path: channelId }).then((res) => {
            response = res;
            done();
          });
        });

        it('should return a channel', () => {
          channel.id = channel._id.toString();
          delete channel._id;

          helper.assert(response.body, channel);
        });

        it('should have a 200 status code', () => {
          expect(response.statusCode).to.equal(200);
        });

        it('should have no errors', () => {
          expect(response.error).to.be.false;
        });
      });

      describe('And an invalid channel ID', () => {
        const invalidId = 'invalidID';

        describe('When a request is made', () => {
          let response;

          before((done) => {
            pRequest({ method: 'get', path: invalidId }).then((res) => {
              response = res;
              done();
            });
          });

          it('should have error messages matching the invalid fields', () => {});

          it('400', () => {
            expect(response.statusCode).to.equal(400);
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
        let response;

        before((done) => {
          pRequest({ method: 'get' }).then((res) => {
            response = res;
            done();
          });
        });

        it('should return 0 channels', () => {
          expect(response.body.length).to.equal(0);
        });

        it('200', () => {
          expect(response.statusCode).to.equal(200);
        });
      });
    });

    describe('Given a channel does not exist', () => {
      const nonExistentChannelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      beforeEach((done) => {
        Channel.remove({}, done);
      });
      describe('When a request is made to get the channel', () => {
        let response;

        before((done) => {
          pRequest({ method: 'get', path: nonExistentChannelId }).then((res) => {
            response = res;
            done();
          });
        });

        it('404', () => {
          expect(response.statusCode).to.equal(404);
        });
      });
    });
  });

  context('UPDATE', () => {
    describe('Given there is a channel', () => {
      const channelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      const channel = _.cloneDeep(mockData[2]);
      channel._id = channelId;

      before((done) => {
        Channel.create(channel, done);
      });

      after((done) => {
        Channel.remove(channel, done);
      });

      describe('When a request is made to update the channel with a new name', () => {
        let response;

        before((done) => {
          pRequest({ method: 'put', path: channelId, data: { show: 'A new show' } }).then((res) => {
            response = res;
            done();
          });
          // TODO: GET request to confirm that items updated
        });

        it('should update the specified channel and return an empty object', () => {
          expect(response.body).to.eql({});
        });

        it('200', () => {
          expect(response.statusCode).to.equal(200);
        });
      });

      describe('When a request is made to update the channel with an invalid query', () => {
        let response;

        before((done) => {
          pRequest({ method: 'put', path: channelId, data: { name: {} } }).then((res) => {
            response = res;
            done();
          });
        });

        it('should update the specified channel and return an empty object', () => {
          // TODO
        });

        it('400', () => {
          expect(response.statusCode).to.equal(400);
        });
      });
    });

    describe('Given a channel does not exist', () => {
      const nonExistentChannelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap

      describe('When a request is made to updade the channel', () => {
        let response;

        before((done) => {
          pRequest({ method: 'put', path: nonExistentChannelId }).then((res) => {
            response = res;
            done();
          });
        });

        it('404', () => {
          expect(response.statusCode).to.equal(404);
        });
      });
    });
  });

  context('DELETE', () => {
    describe('Given there is a channel', () => {
      const channelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      const channel = _.cloneDeep(mockData[0]);
      channel._id = channelId;

      before((done) => {
        Channel.create(channel, done);
      });

      after((done) => {
        Channel.remove(channel, done);
      });

      describe('When a request is made to delete the channel', () => {
        let response;

        before((done) => {
          pRequest({ method: 'del', path: channelId }).then((res) => {
            response = res;
            done();
          });
        });

        it('should delete the specified channel and return an empty object', () => {
          expect(response.body).to.eql({});
        });

        it('204', () => {
          expect(response.statusCode).to.equal(204);
        });
      });

      describe('When a request is made to delete the channel with an invalid query', () => {
        let response;
        // let invalidChannel;

        before((done) => {
          // invalidChannel = _.cloneDeep(mockData[0]);
          // invalidChannel.code = '';
          pRequest({ method: 'del', path: 'channelId' }).then((res) => {
            response = res;
            done();
          });
        });

        it('should return an error message', () => {
          // TODO: expect(response.body).to.eql({});
        });

        it('400', () => {
          expect(response.statusCode).to.equal(400);
        });
      });
    });

    describe('Given a channel does not exist', () => {
      const nonExistentChannelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap

      describe('When a request is made to delete the channel', () => {
        let response;

        before((done) => {
          pRequest({ method: 'del', path: nonExistentChannelId }).then((res) => {
            response = res;
            done();
          });
        });

        it('204', () => {
          expect(response.statusCode).to.equal(204);
        });
      });
    });
  });
});
