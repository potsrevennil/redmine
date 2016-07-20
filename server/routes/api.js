const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
//const logFile = `${__dirname}/../logFiles/EVENTS_20160601.log`;
const logDir = `${__dirname}/../logFiles`;
const DBDir = `${__dirname}/../db`

const stream = csv({
    raw: false,
    separator: ',',
    quote: '"',
    escape: '"',
    newline: '\n',
    headers: ['usr', 'eventId', 'time', 'agent', 'messageId', 'messageString'],
});
    //strict: true,
fs.readdir(logDir, (err, files) => {
  files.forEach((logFile) => {
    const vData = [];
    const readStream = fs.createReadStream(`${logDir}/${logFile}`)
      .pipe(stream)
      .on('data', (data) => {
        vData.push(data);
      }).on('end', () => {
        const DB_PATH = `${DBDir}${logFile.substr(0, logFile.length - 4)}.json`;
        const writeStream = fs.createWriteStream(DB_PATH, {fd: fs.openSync(DB_PATH, 'w'), flags: 'w'});
        writeStream.write(JSON.stringify(vData));
      });
    readStream.setMaxListeners(0)
  });
});

/* GET home page. */
router.get('/:date', function(req, res, next) {
  fs.readFile(`${DBDir}/EVENTS_${req.params.date}.json`, 'utf-8', (err, data) => {
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
