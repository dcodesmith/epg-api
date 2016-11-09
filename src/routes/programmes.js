import express from 'express';
import multer from 'multer';

import programme from '../controller/programme';

const router = express.Router(); // eslint-disable-line new-cap
const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .post('/', programme.create)
  .post('/import', upload.single('programme'), programme.import)
  .get('/', programme.readAll)
  .get('/:id', programme.readOne)
  .put('/:id', programme.update)
  .delete('/:id', programme.delete)
  .delete('/', programme.delete);

export default router;
