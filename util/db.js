import mongoose from 'mongoose';

import logger from './logger';

const {
  DATABASEUSER,
  DATABASEPASSWORD,
  DATABASEPORT,
  DATABASENAME,
  DBSERVERS
} = process.env;
const RECONNECT_TIME = 5000;
const STATES = {
  0: { status: 'Disconnected', code: 0 },
  1: { status: 'Connected', code: 1 },
  2: { status: 'Connecting', code: 2 },
  3: { status: 'Disconnecting', code: 3 },
  4: { status: 'Unable to connect to database', code: 4 },
  5: { status: 'Unable to connect to database', code: 99 }
};

const createDbCredentialString = () => {
  if (!DATABASEUSER && !DATABASEPASSWORD) {
    return '';
  }

  return `${DATABASEUSER}:${DATABASEPASSWORD}@`;
};

const getReplicaHostString = () => {
  const hosts = DBSERVERS.split(',');
  const dbCredentials = createDbCredentialString();

  return hosts
    .map(host => `mongodb://${dbCredentials}${host}:${DATABASEPORT}/${DATABASENAME}`)
    .join(',');
};

// http://bites.goodeggs.com/posts/reconnecting-to-mongodb-when-mongoose-connect-fails-at-startup/

const connectWithRetry = (hostString, options) => {
  mongoose.connect(hostString, options, (error) => {
    if (error) {
      logger.error('Failed to connect to mongo on startup - retrying in 5 sec', error);
      mongoose.disconnect();
      setTimeout(connectWithRetry.bind(null, hostString, options), RECONNECT_TIME);
    }

    logger.info(hostString, STATES[mongoose.connection.readyState]);
  });
};

const connect = (callback) => {
  const hostString = getReplicaHostString();
  const options = {
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 5
  };

  connectWithRetry(hostString, options);

  if (callback && typeof callback === 'function') {
    callback();
  }
};

const disconnect = next => mongoose.disconnect(next);

const status = () => STATES[mongoose.connection.readyState];

export { connect, disconnect, status };
