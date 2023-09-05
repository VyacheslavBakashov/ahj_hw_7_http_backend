const http = require('http');
const app = require('./server.app');

const server = http.createServer(app.callback());

const port = 7000;

server.listen(port, (err) => {
  if (err) {
    console.log('ERROR: ', err);
    return;
  };

  console.log('Server is listening to ' + port);
});
