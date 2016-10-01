const server = require('./src/server');

const port = process.env.PORT || 8080;
const environment = process.env.NODE_ENV || 'development';

server.listen(port, () => {
  console.log(`started app on port ${port} on ${environment} environment`);
});
