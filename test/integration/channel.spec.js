/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import mongoose from 'mongoose';
import HTTPStatus from 'http-status';
import { cloneDeep } from 'lodash';
import Channel from '../../src/models/Channel';
import { promisifyRequest, assert } from '../helper';
import mockData from '../fixtures/channels';

const baseUrl = '/v1/channels';
const request = promisifyRequest(baseUrl);

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
          request({ data: channel }).then((res) => {
            response = res;
            done();
          });
        });

        it('should create one channel', () => {
          assert(response.body, channel);
        });

        it('should have a 201 status code', () => {
          expect(response.statusCode).to.equal(HTTPStatus.CREATED);
        });

        it('should have no errors', () => {
          expect(response.error).to.be.false;
        });
      });

      describe.skip('When a request is made to create 4 new channels', () => {
        const channels = mockData;
        let response = {};

        before((done) => {
          request({ data: channels }).then((res) => {
            response = res;
            done();
          });
        });

        it('should create 4 channels', () => {
          assert(response.body, channels);
        });

        it('should have a 201 status code', () => {
          expect(response.statusCode).to.equal(HTTPStatus.CREATED);
        });

        it('should have no errors', () => {
          expect(response.error).to.be.false;
        });
      });

      describe('And the data to be posted is invalid', () => {
        describe('When a request is made to create a channel', () => {
          let response = {};

          before((done) => {
            request({}).then((res) => {
              response = res;
              done();
            });
          });

          it('should have error messages matching the invalid fields', () => {
            // TODO
          });

          it.skip('400', () => {
            expect(response.statusCode).to.equal(HTTPStatus.BAD_REQUEST);
          });
        });
      });
    });
  });

  context('GET', () => {
    describe('Given there are 4 Channels', () => {
      const clonedMockData = cloneDeep(mockData);

      before((done) => {
        Channel.create(clonedMockData, done);
      });

      after((done) => {
        Channel.remove(done);
      });

      describe('When the 4 channels are requested', () => {
        let response;

        before((done) => {
          request({ method: 'get' }).then((res) => {
            response = res;
            done();
          });
        });

        it.skip('should return 4 channels', () => {
          assert(response.body, clonedMockData);
        });

        it('should have a 200 status code', () => {
          expect(response.statusCode).to.equal(HTTPStatus.OK);
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
            request({ method: 'get', query: { find: query } }).then((res) => {
              response = res;
              done();
            });
          });

          it('should return 1 channel', () => {
            assert(response.body, [expected]);
          });

          it('should have a 200 status code', () => {
            expect(response.statusCode).to.equal(HTTPStatus.OK);
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
            request({ method: 'get', query: { find: query } }).then((res) => {
              response = res;
              done();
            });
          });

          it('should return 1 channel', () => {
            assert(response.body, [expected]);
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
        describe('When the 4 channels are requested', () => {
          let response;

          before((done) => {
            // TODO: Do more
            request({ method: 'get', query: 'sort=-' }).then((res) => {
              response = res;
              done();
            });
          });

          it('should have error messages matching the invalid fields', () => {});

          it.skip('400', () => {
            expect(response.statusCode).to.equal(HTTPStatus.BAD_REQUEST);
          });
        });
      });
    });

    describe('Given there is a channel', () => {
      const channelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      const channel = cloneDeep(mockData[1]);
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
          request({ method: 'get', path: channelId }).then((res) => {
            response = res;
            done();
          });
        });

        it.skip('should return a channel', () => {
          channel._id = channel._id.toString();
          delete channel.id;

          assert(response.body, channel);
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
          let response;

          before((done) => {
            request({ method: 'get', path: invalidId }).then((res) => {
              response = res;
              done();
            });
          });

          it('should have error messages matching the invalid fields', () => {});

          it.skip('400', () => {
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
        let response;

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
        let response;

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
    describe('Given there is a channel', () => {
      const channelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      const channel = cloneDeep(mockData[2]);
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
          request({ method: 'put', path: channelId, data: { show: 'A new show' } }).then((res) => {
            response = res;
            done();
          });
          // TODO: GET request to confirm that items updated
        });

        it('should update the specified channel and return an empty object', () => {
          expect(response.body).to.eql({});
        });

        it('200', () => {
          expect(response.statusCode).to.equal(HTTPStatus.OK);
        });
      });

      describe('When a request is made to update the channel with an invalid query', () => {
        let response;

        before((done) => {
          request({ method: 'put', path: channelId, data: { name: {} } }).then((res) => {
            response = res;
            done();
          });
        });

        it('should update the specified channel and return an empty object', () => {
          // TODO
        });

        it.skip('400', () => {
          expect(response.statusCode).to.equal(HTTPStatus.BAD_REQUEST);
        });
      });
    });

    describe('Given a channel does not exist', () => {
      const nonExistentChannelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap

      describe('When a request is made to updade the channel', () => {
        let response;

        before((done) => {
          request({ method: 'put', path: nonExistentChannelId }).then((res) => {
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
    describe('Given there is a channel', () => {
      const channelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap
      const channel = cloneDeep(mockData[0]);
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
          request({ method: 'del', path: channelId }).then((res) => {
            response = res;
            done();
          });
        });

        it('should delete the specified channel and return an empty object', () => {
          expect(response.body).to.eql({});
        });

        it('204', () => {
          expect(response.statusCode).to.equal(HTTPStatus.NO_CONTENT);
        });
      });

      describe('When a request is made to delete the channel with an invalid query', () => {
        let response;
        // let invalidChannel;

        before((done) => {
          // invalidChannel = cloneDeep(mockData[0]);
          // invalidChannel.code = '';
          request({ method: 'del', path: 'channelId' }).then((res) => {
            response = res;
            done();
          });
        });

        it('should return an error message', () => {
          // TODO: expect(response.body).to.eql({});
        });

        it.skip('400', () => {
          expect(response.statusCode).to.equal(400);
        });
      });
    });

    describe('Given a channel does not exist', () => {
      const nonExistentChannelId = mongoose.Types.ObjectId(); // eslint-disable-line new-cap

      describe('When a request is made to delete the channel', () => {
        let response;

        before((done) => {
          request({ method: 'del', path: nonExistentChannelId }).then((res) => {
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
