const _ = require('lodash');

module.exports = (schema) => {
  // schema.static('createOne', function(options, cb) {
  //   (new this(options.data)).save(cb);
  // });

  schema.static('readAll', function (options) {
    if (typeof options.query === 'string') {
      options.find.$where = options.query;
    }

    return this
      .find(options.find)
      .select(options.select)
      .populate(options.populate || '')
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);
  });

  schema.static('readOne', function (options) {
    return this
      .findOne(options.query)
      .select(options.select)
      .populate(options.populate || '');
  });

  schema.static('update', function (options) {
    return this.findOneAndUpdate(options.query, options.data);
  });

  schema.static('delete', function (options) {
    return this.remove(options.query);
  });

  schema.method('select', function (fields) {
    return _.pick(this.toJSON(), fields);
  });
};
