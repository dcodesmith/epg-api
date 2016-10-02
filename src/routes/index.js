import express from 'express';
import channelRoutes from './channels';
import programmeRoutes from './programmes';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/channels', channelRoutes);
router.use('/programmes', programmeRoutes);
router.use((req, res, next) => {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

export default router;
