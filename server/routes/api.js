const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const logFile = `${__dirname}/../EVENTS_20160601.log`;
const DB_PATH = `${__dirname}/../db.json`;
const writeStream = fs.createWriteStream(`${__dirname}/../db.json`, {flags: 'w'});

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
    vData.push(data);
  })
  .on('end', () => {
    writeStream.write(JSON.stringify(vData));
  });

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readFile(DB_PATH, 'utf-8', (err, data) => {
    if (err) return next(err);
    try {
      const jdata = JSON.parse(data);
      return res.json(jdata);
    } catch (errr) {
      return next(errr);
    }
  }); 
});

module.exports = router;
