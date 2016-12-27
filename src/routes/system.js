import express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router
  .get('/', (req, res) => {
    res.json({ status: 'ok!!!' })
  });

export default router;
