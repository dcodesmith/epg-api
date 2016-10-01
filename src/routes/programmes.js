const multer = require('multer');
const programme = require('../controller/programme');

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = (router) => {
  router
    .post('/programmes', programme.create)
    .post('/programmes/import', upload.single('programme'), programme.import)
    .get('/programmes', programme.readAll)
    .get('/programmes/:id', programme.readOne)
    .put('/programmes/:id', programme.update)
    .delete('/programmes/:id', programme.delete)
    .delete('/programmes', programme.delete);
};
