var express = require('express');
var router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const logFile = `${__dirname}/../EVENTS_20160601.log`;
const DB_PATH = `${__dirname}/../db.json`;
const writeStream = fs.createWriteStream(`${__dirname}/../db.json`, {flags: 'r+'});

const stream = csv({
  raw: false,
  separator: ',',
  quote: '"',
  escape: '"',
  newline: '\n',
  strict: true,
  headers: ['usr', 'status', 'time', 'agent', 'foo', 'bar'],
});
const vData = [];

fs.createReadStream(logFile)
  .pipe(stream)
  .on('data', (data) => {
    const vecDate = data.time.split(' ')[0].split('/');
    const vecTime = data.time.split(' ')[1].split(':');
    const d = {
      usr: data.usr,
      status: data.status,
      year: vecDate[0],
      month: vecDate[1],
      day: vecDate[2],
      hour: vecTime[0],
      min: vecTime[1],
      agent: data.agent,
      foo: data.foo,
      bar: data.bar,
    };
    vData.push(d);
  })
  .on('end', () => {
    writeStream.write(JSON.stringify(vData));
  });

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return next(err);
    try {
      const jdata = JSON.parse(data);
      return res.json(jdata);
    } catch (errr) {
      return next(errr);
    };
  });
});

module.exports = router;