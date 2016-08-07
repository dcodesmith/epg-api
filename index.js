var server = require('./src/server');
var port = process.env.PORT || 8080;
var environment = process.env.NODE_ENV || 'development';

server.listen(port, () => {
  console.log(`started app on port ${ port } on ${ environment } environment`);
});
