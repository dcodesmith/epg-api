var request = require('supertest')(require('../src/server'));
var chai = require('chai');
var expect = chai.expect;

function assertRequest(baseUrl) {
  return function(options, done) {
    var url = options.path ? `${baseUrl}/${options.path}` : baseUrl;

    request[options.method || 'post'](url)
      .send(options.data || {})
      .expect(options.statusCode)
      .end(function(err, res){
        if (err) {
          return done(err);
        }
        done();
      });
  }
};

function promisifyRequest(baseUrl) {
  return function(options) {
    return new Promise(function(resolve, reject) {
      var url = options.path ? `${baseUrl}/${options.path}` : baseUrl;

      request[options.method || 'post'](url)
        .send(options.data || {})
        .query(options.query || {})
        .end(function(err, res){
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
    });
  }
}

function assert(actual, expected) {
  if (!Array.isArray(actual)) {
    _assert(actual, expected);
  } else {
    expect(expected.length).to.equal(actual.length);
    for (var i = 0; i < expected.length; i++) {
      _assert(actual[i], expected[i]);
    }
}


}

function _assert(actual, expected) {
  for (var key in expected) {
    if (key === 'channel') {
      // console.log('channel', typeof actual[key], typeof expected[key]);
      expected[key] = String(expected[key]);
    }
    expect(actual[key]).to.equal(expected[key]);
  }
}

module.exports = {
  assertRequest: assertRequest,
  promisifyRequest: promisifyRequest,
  assert: assert
};
