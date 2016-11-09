import HTTPStatus from 'http-status';
import handler from './../../util/handler';

function errorHandler(next, err) {
  const error = new Error(err);
  error.status = HTTPStatus.BAD_REQUEST;

  next(err);
}

export default function createController(model, extra) {
  const modelHandler = handler(model);

  /* eslint-disable consistent-return */
  return Object.assign({}, {
    create(req, res, next) {
      modelHandler.create(req, (err, item) => {
        if (err) {
          return errorHandler(next, err);
        }

        res.status(HTTPStatus.CREATED).json(item);
      });
    },

    readAll(req, res, next) {
      modelHandler.read.all(req, (err, items) => {
        if (err) {
          return errorHandler(next, err);
        }
        res.status(HTTPStatus.OK).json(items);
      });
    },

    readOne(req, res, next) {
      modelHandler.read.one(req, (err, item) => {
        if (err) {
          return errorHandler(next, err);
        }

        if (!item) {
          return res.sendStatus(HTTPStatus.NOT_FOUND);
        }

        res.status(HTTPStatus.OK).json(item);
      });
    },

    update(req, res, next) {
      modelHandler.update(req, (err, item) => {
        if (err) {
          return errorHandler(next, err);
        }

        if (!item) {
          return res.sendStatus(HTTPStatus.NOT_FOUND);
        }

        res.sendStatus(HTTPStatus.OK);
      });
    },

    delete(req, res, next) {
      modelHandler.delete(req, (err, item) => {
        if (err) {
          return errorHandler(next, err);
        }

        if (!item) {
          return res.sendStatus(HTTPStatus.NOT_FOUND);
        }

        res.sendStatus(HTTPStatus.NO_CONTENT);
      });
    }
  }, extra);
}
