var fs = require('fs');

module.exports = function (model) {
  return require('./' + model);
}
