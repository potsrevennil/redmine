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
  fs.readFile(`${DBDir}/EVENTS_${req.params.date}.json`, 'utf-8', (err, data1) => {
    const date = req.params.date;
    const today = new Date(`${date.substr(0, 4)}/${date.substr(4, 2)}/${date.substr(6, 2)}`);
    const yesterday = new Date(today.setDate(today.getDate() - 1));
    const yDate = yesterday.getFullYear() 
      + ('0' + (yesterday.getMonth()+1)).slice(-2)
      + ('0' + yesterday.getDate()).slice(-2);

    fs.readFile(`${DBDir}/EVENTS_${yDate}.json`, 'utf-8', (err, data2) => {
    
      if (err) {
        return next(err);
      }
      try {
        const jdata = JSON.parse(data2).concat(JSON.parse(data1));
        return res.json(jdata);
      } 
      catch (errr) {
        return next(errr);
      }
    })
  }); 
});

module.exports = router;
