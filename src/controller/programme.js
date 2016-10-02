import stream from 'stream';
import HTTPStatus from 'http-status';
import csv from '../csv';
import Programme from '../model/Programme';
import createController from './index';

const errorHandler = (next, err) => {
  if (err) {
    const error = new Error(err);
    error.status = 400;

    next(err);
  }
};

const imports = (req, res, next) => {
  const bufferStream = new stream.PassThrough();

  if (!req.file) {
    return res.status(HTTPStatus.BAD_REQUEST).json({
      message: 'no csv file found'
    });
  }

  bufferStream.end(req.file.buffer);

  csv.parse(bufferStream)
    .then((result) => {
      return Programme.create(result);
    }, (error) => {
      res.status(HTTPStatus.BAD_REQUEST).json({ errors: error });
    })
    .then((programmes) => {
      res.status(HTTPStatus.CREATED).json(programmes);
    }, (err) => {
      errorHandler(next, err);
    });
};

export default createController(Programme, { import: imports });
