var handler = require('./../../util/handler');
var validators = require('./validators');
var util = require('util');
var error;

function errorHandler(next, err) {
  var err = new Error(err);
  err.status = 400;
  next(err);
}

module.exports = function (model) {
  var modelHandler = handler(model);
  var validator = validators(model.modelName.toLowerCase());

  return {
    create: function (req, res, next) {
      // TODO: Add error message. And read them in the tests
      // var temp;
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

      modelHandler.create(req, function(err, item) {
        if (err) {
          return errorHandler(next, err);
        }

        res.status(201).json(item);
      });
    },

    readAll: function (req, res, next) {
      modelHandler.read.all(req, function(err, items) {
        if (err) {
          return errorHandler(next, err);
        }

        res.status(200).json(items);
      });
    },

    readOne: function (req, res, next) {
      modelHandler.read.one(req, function(err, item) {
        if (err) {
          return errorHandler(next, err);
        }

        if (!item) {
          return res.sendStatus(404);
        }

        res.status(200).json(item);
      });
    },

    update: function (req, res, next) {
      modelHandler.update(req, function(err, item) {
        if (err) {
          return errorHandler(next, err);
        }

        if (!item) {
          return res.sendStatus(404);
        }

        res.sendStatus(200);
      });
    },

    delete: function (req, res, next) {
      modelHandler.delete(req, function(err, item) {
        if (err) {
          return errorHandler(next, err);
        }

        if (!item) {
          return res.sendStatus(404);
        }

        res.sendStatus(204);
      });
    }
  };
}
