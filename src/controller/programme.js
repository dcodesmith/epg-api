'use strict';

var Programme = require('../model/Programme');
var csv = require('../csv');
var stream = require('stream');
var index = require('./index')(Programme);

exports.import = function(req, res, next) {
  var bufferStream = new stream.PassThrough();

  if (!req.file) {
    return res.status(400).json({
      message: 'no csv file found'
    });
  }

  bufferStream.end(req.file.buffer);

  csv.parse(bufferStream)
    .then(function(result) {
      console.log(result.length);
      return Programme.create(result);
    }, function(error) {
      res.status(400).json({errors: error});
    })
    .then(function(programmes) {
      res.status(201).json(programmes);
    }, errorHandler);
}

function errorHandler(err) {
  if (err) {
    var err = new Error(err);
    err.status = 400;
    next(err);
  }
}

Object.assign(exports, index);
