import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/server';

const request = supertest(app);

function assertRequest(baseUrl) {
  return function (options, done) {
    const url = options.path ? `${baseUrl}/${options.path}` : baseUrl;

    request[options.method || 'post'](url)
      .send(options.data || {})
      .expect(options.statusCode)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  };
}

function promisifyRequest(baseUrl) {
  return function (options) {
    return new Promise((resolve, reject) => {
      const url = options.path ? `${baseUrl}/${options.path}` : baseUrl;

      request[options.method || 'post'](url)
        .send(options.data || {})
        .query(options.query || {})
        .end((err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
    });
  };
}

function assert(actual, expected) {
  if (!Array.isArray(actual)) {
    _assert(actual, expected);
  } else {
    expect(expected.length).to.equal(actual.length);
    for (let i = 0; i < expected.length; i += 1) {
      _assert(actual[i], expected[i]);
    }
  }
}

function _assert(actual, expected) {
  for (let key in expected) {
    if (key === 'channel') {
      // console.log('channel', typeof actual[key], typeof expected[key]);
      expected[key] = String(expected[key]);
    }
    expect(actual[key]).to.equal(expected[key]);
  }
}

export { assertRequest, promisifyRequest, assert };
