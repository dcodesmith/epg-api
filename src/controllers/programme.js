import stream from 'stream';
import HTTPStatus from 'http-status';
import waterfall from 'async/waterfall';
import parseCSV from '../csv';
import Programme from '../models/Programme';
import Channel from '../models/Channel';
import createController from './index';

const errorHandler = (next, err) => {
  if (err) {
    const error = new Error(err);
    error.status = 400;

    next(error);
  }
};

const importCSV = (request, response, next) => {
  const bufferStream = new stream.PassThrough();
  const { file } = request;

  if (!file) {
    // NoCSVFile exception
    response
      .status(HTTPStatus.BAD_REQUEST)
      .json({
        message: 'no csv file found'
      });

    return;
  }

  bufferStream.end(file.buffer);

  const getAllChannels = callback => Channel.find(callback);
  const parse = (channels, callback) => parseCSV(bufferStream, channels, callback);
  const saveProgrammes = (programmes, callback) => Programme.create(programmes, callback);
  const getAllProgrammes = (results, callback) => {
    // TODO - Refactor to use callback
    Programme
      .find()
      .populate('channel')
      .then(programmes => callback(null, programmes))
      .catch(callback);
  };

  const tasks = [getAllChannels, parse, saveProgrammes, getAllProgrammes];

  waterfall(tasks, (error, result) => {
    if (error) {
      // check the error type
      return errorHandler(next, error);
    }

    return response.status(HTTPStatus.CREATED).json(result);
  });
};

export default createController(Programme, { importCSV });
