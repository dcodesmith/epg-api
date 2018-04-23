import express from 'express';
import bodyParser from 'body-parser';
import validator from 'express-validator';
import cors from 'cors';
import logger from 'morgan';
import routes from './routes';
import { connect } from './util/db';
import { httpLogger, errorHandler } from './middlewares';

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
app.use('/v1', errorHandler);

export default app;
