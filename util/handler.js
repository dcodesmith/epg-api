import _ from 'lodash';

export default function handler(model, options) {
  return {
    create: (args, callback) => {
      const doc = args.body;

      model.create(doc)
        .then((item) => {
          callback(null, item);
        }, callback);
    },

    read: {
      all: (args, callback) => {
        const options = {};
        let param = {};

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
          .then((items) => {
            callback(null, items);
          }, callback);
      },

      one: (args, callback) => {
        let options = {};

        options.query = { _id: args.params.id };
        options.select = (args.query.select || '').replace(',', ' ');
        options.populate = (args.query.populate || '').replace(',', ' ');

        model.readOne(options)
          .then((item) => {
            callback(null, item);
          }, callback);
      }
    },

    update: (args, callback) => {
      const conditions = {};

      conditions.query = { _id: args.params.id };
      conditions.data = args.body;

      if (options && options.restrictTo) {
        conditions.data = _.pick(conditions.data, options.restrictTo);
      }

      model.update(conditions)
        .then((item) => {
          callback(null, item);
        }, callback);
    },

    delete: (args, callback) => {
      const options = {};

      options.query = args.params.id ? { _id: args.params.id } : {};

      model.delete(options)
        .then((item) => {
          callback(null, item);
        }, callback);
    }

  };
}
