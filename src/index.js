import server from './server';
import logger from './util/logger';

const { PORT = 8000, NODE_ENV = 'development' } = process.env;

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Possibly Unhandled Rejection at: Promise, ${promise}, reason: ${reason}`);
});

server.listen(PORT, () => {
  logger.info(`Server started on port ${PORT} on ${NODE_ENV} environment`);
});
