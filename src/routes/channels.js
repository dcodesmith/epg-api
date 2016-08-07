var channel = require('../controller/channel');
var Channel = require('../model/Channel');
var handler = require('./../../util/handler');

module.exports = function (router) {

  router
    .post('/channels', channel.create)
    .get('/channels/:id', channel.readOne)
    .get('/channels', channel.readAll)
    .put('/channels/:id', channel.update)
    .delete('/channels/:id', channel.delete)
    .delete('/channels', channel.delete);

}
