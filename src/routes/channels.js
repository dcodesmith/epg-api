const channel = require('../controller/channel');

module.exports = function (router) {
  router
    .post('/channels', channel.create)
    .get('/channels/:id', channel.readOne)
    .get('/channels', channel.readAll)
    .put('/channels/:id', channel.update)
    .delete('/channels/:id', channel.delete)
    .delete('/channels', channel.delete);
};
