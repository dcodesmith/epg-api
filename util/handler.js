var _ = require('lodash');

module.exports = function (model, options) {
  'use strict';

  return {
    create: function (args, callback) {
      var doc = args.body;

      model.create(doc)
        .then(function(item) {
          callback(null, item);
        }, callback);
    },

    read: {
      all: function (args, callback) {
        var options = {},
          param;

        options.find = {};

        if (typeof args.query.find === 'string') {
          options.find = JSON.parse(args.query.find);
        } else if (typeof args.query.find === 'object' && !Array.isArray(args.query.find)) {
          options.find = args.query.find;
        }

        for (param in args.params) {
          if (param.indexOf('_') < 0) {
            options.find[param] = args.params[param];
          }
        }

        options.calculation = args.query.calculation;
        options.query = args.query.query;
        options.select = (args.query.select || '').replace(',', ' ');
        options.populate = (args.query.populate || '').replace(',', ' ');
        options.sort = (args.query.sort || '').replace(',', ' ');
        options.limit = args.query.limit;
        options.skip = args.query.skip;

        model.readAll(options)
          .then(function (items) {
            callback(null, items);
          }, callback);
        },

        one: function (args, callback) {
          var options = {};

          options.query = {_id: args.params.id};
          options.select = (args.query.select || '').replace(',', ' ');
          options.populate = (args.query.populate || '').replace(',', ' ');

          model.readOne(options)
            .then(function(item) {
              callback(null, item);
            }, callback);
        }
    },

    update: function (args, callback) {
      var conditions = {};

      conditions.query = {_id: args.params.id};
      conditions.data = args.body;

      if (options && options.restrictTo) {
        conditions.data = _.pick(conditions.data, options.restrictTo);
      }

      model.update(conditions)
        .then(function(item) {
          callback(null, item);
        }, callback);
    },

    delete: function (args, callback) {
      var options = {};

      options.query = args.params.id ? { _id: args.params.id } : {};

      model.delete(options)
        .then(function (item, result) {
          callback(null, item);
        }, callback);
    }

  };
};
