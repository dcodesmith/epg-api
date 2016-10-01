const Programme = require('../model/Programme');
const csv = require('../csv');
const stream = require('stream');
const index = require('./index')(Programme);
const HTTPStatus = require('http-status');

const errorHandler = (next, err) => {
  if (err) {
    const error = new Error(err);
    error.status = 400;

    next(err);
  }
};

exports.import = (req, res, next) => {
  const bufferStream = new stream.PassThrough();

  if (!req.file) {
    return res.status(400).json({
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

Object.assign(exports, index);
