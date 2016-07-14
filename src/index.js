const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
};
var vData;

const req = http.request(options, (res) => {
  res.on('data', (data) => {
    vData = JSON.parse(JSON.stringify((data.toString())));
  });
});

req.end();
