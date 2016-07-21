const express = require('express');
const router = express.Router();
const fs = require('fs');
const logDir = `${__dirname}/../logFiles`;
const DBDir = `${__dirname}/../db`

var vData = [];
fs.readdir(logDir, (err, files) => {
  files.forEach ((logFile, i) => {
    fs.readFile(`${logDir}/${logFile}`, 'utf-8', (err, data) => {
        const fileArray = data.split('\n');
        fileArray.forEach((fa) => {
          if (fa.length !== 0) {
            const faa = fa.split(',');
            const obj = {};
            obj['usr'] = faa[0];
            obj['eventId'] = faa[1];
            obj['time'] = faa[2];
            obj['agent'] = faa[3];
            obj['messageId'] = faa[4];
            obj['messageString'] = faa[5];
            vData.push(obj);
          }
        });
        const DB_PATH = `${DBDir}/${logFile.substr(0, logFile.length - 4)}.json`;
        const writeStream = fs.createWriteStream(DB_PATH, {fd: fs.openSync(DB_PATH, 'w'), flags: 'w'});
        writeStream.write(JSON.stringify(vData));
        vData = [];
    });
  });
});

/* GET home page. */
router.get('/:date', function(req, res, next) {
  fs.readFile(`${DBDir}/EVENTS_${req.params.date}.json`, 'utf-8', (err, data) => {
    if (err) {
      return next(err);
    }
    try {
      const jdata = JSON.parse(data);
      return res.json(jdata);
    } 
    catch (errr) {
      return next(errr);
    }
  }); 
});

module.exports = router;
