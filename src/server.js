import express from 'express';
import bodyParser from 'body-parser';
import HTTPStatus from 'http-status';
import validator from 'express-validator';
import cors from 'cors';
import logger from 'morgan';
import routes from './routes';
import { connect } from './../util/db';
import { httpLogger } from './middlewares';

const app = express();
const envirnoment = process.env.NODE_ENV || 'development';

connect();

if (envirnoment === 'development') {
  app.use(logger('dev'));
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

if (envirnoment !== 'development' && envirnoment !== 'test') {
  app.use(httpLogger);
}

app.use('/v1', routes);

app.use('/v1', (err, request, response, next) => { // eslint-disable-line no-unused-vars
  const { status = HTTPStatus.INTERNAL_SERVER_ERROR, message, error = {} } = err;

  response
    .status(status)
    .json({ message, error });
});

export default app;
