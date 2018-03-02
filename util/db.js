import mongoose from 'mongoose';
import winston from 'winston';

const username = process.env.DATABASEUSER;
const password = process.env.DATABASEPASSWORD;
const port = process.env.DATABASEPORT;
const name = process.env.DATABASENAME;
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
  if (!username && !password) {
    return '';
  }

  return `${username}:${password}@`;
};

const getReplicaHostString = () => {
  const hosts = process.env.DBSERVERS.split(',');
  const hostsArray = [];
  const dbCredentials = createDbCredentialString();
  let dbUrl;

  hosts.forEach((db) => {
    dbUrl = `mongodb://${dbCredentials}${db}:${port}/${name}`;

    hostsArray.push(dbUrl);
  });

  return hostsArray.join(',');
};

// http://bites.goodeggs.com/posts/reconnecting-to-mongodb-when-mongoose-connect-fails-at-startup/

const connectWithRetry = (hostString, options) => {
  mongoose.connect(hostString, options, (err) => {
    if (err) {
      winston.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      mongoose.disconnect();
      setTimeout(connectWithRetry.bind(null, hostString, options), RECONNECT_TIME);
    }
    // TODO: replace with winston logger
    console.log(hostString, STATES[mongoose.connection.readyState]);
  });
};

const connect = () => {
  const hostString = getReplicaHostString();
  const options = {
    auto_reconnect: true
  };
  connectWithRetry(hostString, options);
};

const disconnect = (next) => { mongoose.disconnect(next); };

const status = () => {
  const dbStatus = STATES[mongoose.connection.readyState];

  return dbStatus;
};


export { connect, disconnect, status };
