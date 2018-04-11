import {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  NO_CONTENT
} from 'http-status';
import handler from './../../util/handler';

const errorHandler = (next, err) => {
  const error = new Error(err);
  error.status = BAD_REQUEST;

  next(error);
};

export default (model, extra) => {
  const modelHandler = handler(model);

  /* eslint-disable consistent-return */
  return Object.assign({}, {
    create(request, response, next) {
      modelHandler.create(request, (error, items) => {
        if (error) {
          return errorHandler(next, error);
        }

        response.status(CREATED).json(items);
      });
    },

    readAll(request, response, next) {
      modelHandler.read.all(request, (error, items) => {
        if (error) {
          return errorHandler(next, error);
        }

        response.status(OK).json(items);
      });
    },

    readOne(request, response, next) {
      modelHandler.read.one(request, (error, item) => {
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
      modelHandler.update(request, (error, item) => {
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
      modelHandler.delete(request, (error, item) => {
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
