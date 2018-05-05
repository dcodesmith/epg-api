import express from 'express';
import multer from 'multer';

import programme from '../controllers/programme';
import { asyncMiddleware } from '../middlewares';

const {
  create,
  importCSV,
  readAll,
  readOne,
  update,
  del
} = programme;
const router = express.Router(); // eslint-disable-line new-cap
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default router
  .post('/', create)
  .post('/import', upload.single('programme'), asyncMiddleware(importCSV))
  .get('/', readAll)
  .get('/:id', readOne)
  .put('/:id', update)
  .delete('/:id', del)
  .delete('/', del);
