import winston from 'winston';

require('winston-loggly-bulk');

const { NODE_ENV = 'development', LOGGLYTOKEN, LOGGLYSUBDOMAIN } = process.env;
const transports = [];

if (NODE_ENV === 'development' || NODE_ENV === 'test') {
  transports.push(new (winston.transports.Console)());
}

if (NODE_ENV !== 'development' && NODE_ENV !== 'test') {
  transports.push(new (winston.transports.Loggly)({
    token: LOGGLYTOKEN,
    subdomain: LOGGLYSUBDOMAIN,
    json: true
  }));
}

export { transports };
export default new (winston.Logger)({ transports });
