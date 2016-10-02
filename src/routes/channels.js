import express from 'express';
import channel from '../controller/channel';

const router = express.Router(); // eslint-disable-line new-cap

router
  .post('/', channel.create)
  .put('/:id', channel.update)
  .get('/:id', channel.readOne)
  .get('/', channel.readAll)
  .delete('/:id', channel.delete)
  .delete('/', channel.delete);

export default router;
