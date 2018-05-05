import {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  NO_CONTENT
} from 'http-status';
import handler from './helpers/handler';

const errorHandler = (next, err) => {
  const error = new Error(err);
  error.status = BAD_REQUEST;

  next(error);
};

export default (model, extra) => {
  const {
    create, read, update, delete: del
  } = handler(model);

  /* eslint-disable consistent-return */
  return Object.assign({}, {
    create(request, response, next) {
      create(request, (error, items) => {
        if (error) {
          return errorHandler(next, error);
        }

        response.status(CREATED).json(items);
      });
    },

    readAll(request, response, next) {
      read.all(request, (error, items) => {
        if (error) {
          return errorHandler(next, error);
        }

        response.status(OK).json(items);
      });
    },

    readOne(request, response, next) {
      read.one(request, (error, item) => {
        if (error) {
          return errorHandler(next, error);
        }

        if (!item) {
          return response.sendStatus(NOT_FOUND);
        }

        response.status(OK).json(item.toJSON());
      });
    },

    update(request, response, next) {
      update(request, (error, item) => {
        if (error) {
          return errorHandler(next, error);
        }

        if (!item) {
          return response.sendStatus(NOT_FOUND);
        }

        response.sendStatus(OK);
      });
    },

    del(request, response, next) {
      del(request, (error, item) => {
        if (error) {
          return errorHandler(next, error);
        }

        if (!item) {
          return response.sendStatus(NOT_FOUND);
        }

        response.sendStatus(NO_CONTENT);
      });
    }
  }, extra);
};
