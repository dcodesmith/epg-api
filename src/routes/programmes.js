var programme = require('../controller/programme');
var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

module.exports = function (router) {

  router
    .post('/programmes', programme.create)
    .post('/programmes/import', upload.single('programme'), programme.import)
    .get('/programmes', programme.readAll)
    .get('/programmes/:id', programme.readOne)
    .put('/programmes/:id', programme.update)
    .delete('/programmes/:id', programme.delete)
    .delete('/programmes', programme.delete);

}
