import express from 'express';
import channel from '../controllers/channel';

const {
  create,
  update,
  readOne,
  readAll,
  del
} = channel;

const router = express.Router(); // eslint-disable-line new-cap

export default router
  .post('/', create)
  .put('/:id', update)
  .get('/:id', readOne)
  .get('/', readAll)
  .delete('/:id', del)
  .delete('/', del);
