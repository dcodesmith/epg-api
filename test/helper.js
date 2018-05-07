import supertest from 'supertest';
import { expect } from 'chai';
import server from '../src/server';

const app = supertest(server);

const assertRequest = baseUrl => (options, done) => {
  const url = options.path ? `${baseUrl}/${options.path}` : baseUrl;

  app[options.method || 'post'](url)
    .send(options.data || {})
    .expect(options.statusCode)
    .end((error) => {
      if (error) {
        return done(error);
      }

      return done();
    });
};

const request = baseUrl => (options = {}) => {
  const url = options.path ? `${baseUrl}/${options.path}` : baseUrl;
  const { method = 'post', data = {}, query = {} } = options;

  return app[method](url)
    .send(data)
    .query(query);
};

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
  Object.keys(expected).forEach((key) => {
    if (key === 'channel') {
      // eslint-disable-next-line no-param-reassign
      expected[key] = String(expected[key]);
    }

    expect(actual[key]).to.equal(expected[key]);
  });
}

export { assertRequest, request, assert };
