var fs = require('fs');

module.exports = function (router) {
  var routeName;

  fs.readdirSync(__dirname).forEach(function(fileName) {
    if (fileName === 'index.js') {
      return;
    }

    routeName = fileName.substr(0, fileName.indexOf('.'));
    require('./' + routeName)(router);
  });
}
