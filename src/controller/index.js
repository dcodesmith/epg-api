const HTTPStatus = require('http-status');
const handler = require('./../../util/handler');
// const validators = require('./validators');

function errorHandler(next, err) {
  const error = new Error(err);
  error.status = HTTPStatus.BAD_REQUEST;

  next(err);
}

module.exports = (model) => {
  const modelHandler = handler(model);
  // const validator = validators(model.modelName.toLowerCase());

  return {
    create(req, res, next) {
      // TODO: Add error message. And read them in the tests
      // let temp;
      //
      // req.check(validator.create);
      // error = req.validationErrors();
      // temp = error;
      //
      // if (error) {
      //   error =  {};
      //   error.status = 400;
      //   error.message = temp;
      //
      //   return next(error);
      // }

      modelHandler.create(req, (err, item) => {
        if (err) {
          return errorHandler(next, err);
        }

        return res.status(HTTPStatus.CREATED).json(item);
      });
    },

    readAll(req, res, next) {
      modelHandler.read.all(req, (err, items) => {
        if (err) {
          return errorHandler(next, err);
        }

        return res.status(HTTPStatus.OK).json(items);
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

        return res.status(HTTPStatus.OK).json(item);
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

        return res.sendStatus(HTTPStatus.OK);
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

        return res.sendStatus(HTTPStatus.NO_CONTENT);
      });
    }
  };
};
