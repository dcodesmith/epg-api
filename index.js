import server from './src/server';

const { PORT = 8000, NODE_ENV = 'development' } = process.env;
const port = PORT;
const environment = NODE_ENV;

server.listen(port, () => {
  console.log(`started app on port ${port} on ${environment} environment`);
});

process.on('unhandledRejection', (error, p) => { // eslint-disable-line no-unused-vars
  // TODO: use logger only on development ENV
});
