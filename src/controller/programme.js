import stream from 'stream';
import HTTPStatus from 'http-status';
import waterfall from 'async/waterfall';

import parseCSV from '../csv';
import Programme from '../model/Programme';
import Channel from '../model/Channel';
import createController from './index';

const errorHandler = (next, err) => {
  if (err) {
    const error = new Error(err);
    error.status = 400;

    next(error);
  }
};

const imports = (req, res, next) => {
  const bufferStream = new stream.PassThrough();

  if (!req.file) {
    res.status(HTTPStatus.BAD_REQUEST).json({
      message: 'no csv file found'
    });
    return;
  }

  console.log('PRE buff len', bufferStream.length);

  bufferStream.end(req.file.buffer);

  console.log('POST buff len', bufferStream.length);

  const getAllChannels = (callback) => {
    Channel.find(callback);
  };

  const parse = (channels, callback) => {
    parseCSV(bufferStream, channels, callback);
  };

  const saveProgrammes = (programmes, callback) => {
    console.log('len', programmes.length);
    Programme.create(programmes, callback);
  };

  const getAllProgrammes = (results, callback) => {
    // TODO - Refactor to use callback
    Programme.find().populate('channel').then((programmes) => {
      callback(null, programmes);
    }).catch(callback);
  };

  waterfall([
    getAllChannels,
    parse,
    saveProgrammes,
    getAllProgrammes
  ], (err, result) => {
    if (err) {
      return errorHandler(next, err);
    }

    res.status(HTTPStatus.CREATED).json(result);
  });
};

export default createController(Programme, { import: imports });
