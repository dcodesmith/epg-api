var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('./../util/db');
var cors = require('cors');
var validator = require('express-validator');

db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

require('./routes')(router);

app.use('/api', router);
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});
app.use('/api', function(err, req, res, next) {
  res
    .status(err.status || 500)
    .json({message: err.message, error: err.error || {}});
});

module.exports = app;
