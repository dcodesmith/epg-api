import express from 'express';
import bodyParser from 'body-parser';
import HTTPStatus from 'http-status';
import validator from 'express-validator';
import cors from 'cors';
import logger from 'morgan';
import routes from './routes';
import { connect } from './../util/db';

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

app.use('/api', routes);

app.use('/api', (err, req, res) => {
  res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR)
    .json({ message: err.message, error: err.error || {} });
});

export default app;
