const Channel = require('../model/Channel');
const index = require('./index')(Channel);

Object.assign(exports, index);
