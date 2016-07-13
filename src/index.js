const http = require('http');

var options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
};

var req = http.request(options, (res) => {
  //console.log(`STATUS:${res.statusCode}`);
  res.on('data', (data) => {
    console.log(data.toString('utf8'));
  });
});

req.end();
