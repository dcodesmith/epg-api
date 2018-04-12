import pick from 'lodash/fp/pick';

export default (model, options) => ({
  create: (args, callback) => {
    const doc = args.body;

    model
      .create(doc)
      .then(item => callback(null, item), callback);
  },

  read: {
    all: (args, callback) => {
      let options = {}; // eslint-disable-line no-shadow
      const { query: { find }, params } = args;
      options.find = {};

      if (typeof find === 'string') {
        options.find = JSON.parse(find);
      } else if (typeof find === 'object' && !Array.isArray(find)) {
        options = { find };
      }

      Object.keys(params).forEach((param) => {
        if (param.indexOf('_') < 0) {
          options.find[param] = args.params[param];
        }
      });

      options.calculation = args.query.calculation;
      options.query = args.query.query;
      options.select = (args.query.select || '').replace(',', ' ');
      options.populate = (args.query.populate || '').replace(',', ' ');
      options.sort = (args.query.sort || '').replace(',', ' ');
      options.limit = args.query.limit;
      options.skip = args.query.skip;

      model
        .readAll(options)
        .then(items => callback(null, items), callback);
    },

    one: (args, callback) => {
      const options = {}; // eslint-disable-line no-shadow

      options.query = { _id: args.params.id };
      options.select = (args.query.select || '').replace(',', ' ');
      options.populate = (args.query.populate || '').replace(',', ' ');

      model
        .readOne(options)
        .then(item => callback(null, item), callback);
    }
  },

  update: (args, callback) => {
    const conditions = {};

    conditions.query = { _id: args.params.id };
    conditions.data = args.body;

    if (options && options.restrictTo) {
      conditions.data = pick(conditions.data, options.restrictTo);
    }

    model
      .update(conditions)
      .then(item => callback(null, item), callback);
  },

  delete: (args, callback) => {
    const options = {}; // eslint-disable-line no-shadow

    options.query = args.params.id ? { _id: args.params.id } : {};

    model
      .delete(options)
      .then(item => callback(null, item), callback);
  }
});
