'use strict';

var mongoose = require('mongoose');
var winston = require('winston');
var username = process.env.DATABASEUSER;
var password = process.env.DATABASEPASSWORD;
var port = process.env.DATABASEPORT;
var name = process.env.DATABASENAME;
var RECONNECT_TIME = 5000;
var STATES = {
    '0': {
      status: 'Disconnected',
      code: 0
    },
    '1': {
      status: 'Connected',
      code: 1
    },
    '2': {
      status: 'Connecting',
      code: 2
    },
    '3': {
      status: 'Disconnecting',
      code: 3
    },
    '4': {
      status: 'Unable to connect to database',
      code: 4
    },
    '5': {
      status: 'Unable to connect to database',
      code: 99
    }
  };

function createDbCredentialString() {
  if (!username && !password) {
    return '';
  }
  return username + ':' + password + '@';
}

function createDbUrl(dbCredentials, db) {
  return 'mongodb://' + dbCredentials + db + ':' + port + '/' + name;
}

function getReplicaHostString() {
  var hosts = process.env.DBSERVERS.split(',');
  var hostsArray = [];
  var dbCredentials = createDbCredentialString();
  var dbUrl;

  hosts.forEach(function(db) {
    dbUrl = createDbUrl(dbCredentials, db);

    hostsArray.push(dbUrl);
  });

  return hostsArray.join(',');
}

// http://bites.goodeggs.com/posts/reconnecting-to-mongodb-when-mongoose-connect-fails-at-startup/

function connectWithRetry(hostString, options) {
  return mongoose.connect(hostString, options, function(err) {
    if (err) {
      winston.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      mongoose.disconnect();
      setTimeout(connectWithRetry.bind(null, hostString, options), RECONNECT_TIME);
    }
    // TODO: replace with winston logger
    console.log(hostString, STATES[mongoose.connection.readyState]);
  });
}

module.exports = {
  connect: function() {
    var hostString = getReplicaHostString();
    var options = {
      server: {
        auto_reconnect: true
      }
    };
    connectWithRetry(hostString, options);
  },
  disconnect: function(next) {
    return mongoose.disconnect(next);
  },
  status: function() {
    return STATES[mongoose.connection.readyState];
  }
};
