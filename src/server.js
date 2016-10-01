const express = require('express');
const bodyParser = require('body-parser');
const HTTPStatus = require('http-status');

const app = express();
const router = express.Router(); // eslint-disable-line new-cap
const db = require('./../util/db');
const cors = require('cors');
const validator = require('express-validator');

db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

require('./routes')(router);

app.use('/api', router);
router.use((req, res, next) => {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});
app.use('/api', (err, req, res) => {
  res
    .status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR)
    .json({ message: err.message, error: err.error || {} });
});

module.exports = app;
