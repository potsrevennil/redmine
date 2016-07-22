const express = require('express');
const router = express.Router();
const fs = require('fs');
const logDir = `${__dirname}/../logFiles`;
const DBDir = `${__dirname}/../db`

var obj = {};
fs.readdir(logDir, (err, files) => {
  files.forEach ((logFile, i) => {
    fs.readFile(`${logDir}/${logFile}`, 'utf-8', (err, data) => {
        const DB_PATH = `${DBDir}/${logFile.substr(0, logFile.length - 4)}.json`;
        fs.createWriteStream(DB_PATH, {fd: fs.openSync(DB_PATH, 'w'), flags: 'w'}).write('[');
        var sep = "";
        const fileArray = data.split('\n');
        fileArray.forEach((fa, ii) => {
          if (fa.length !== 0) {
            const faa = fa.split(',');
            const eventId = faa[1];
            const messageString = faa[5];
            if (Object.getOwnPropertyNames(obj).length === 0) {
              if (eventId === '10' && messageString.indexOf('successful') !== -1) {
                obj['usr'] = [faa[0]];
              } else {
                obj['usr'] = [];
              }
            } 
            else {
              if (eventId === '10' && messageString.indexOf('successful') !== -1) {
                obj['usr'].push(faa[0]);
              } 
              else if (eventId === '85') {
                const iusr = obj['usr'].indexOf(faa[0]);
                if ( iusr !== -1) {
                  obj['usr'].splice(iusr, 1);
                } else {
                  return;
                }
              }
              else {
                return;
              }
            }
            
            obj['time'] = faa[2];
            obj['agent'] = faa[3];
            obj['messageId'] = faa[4];
            //vData.push(obj);
            const writeStream = fs.createWriteStream(DB_PATH, {fd: fs.openSync(DB_PATH, 'a'), flags: 'r+'});
            writeStream.write(sep + JSON.stringify(obj));
            if (!sep) {
              sep = ',';
            }
          }
        });
        fs.createWriteStream(DB_PATH, {fd: fs.openSync(DB_PATH, 'a'), flags: 'r+'}).write(']');
    });
  });
});



/* GET home page. */
router.get('/:date', function(req, res, next) {
  fs.readFile(`${DBDir}/EVENTS_${req.params.date}.json`, 'utf-8', (err1, data1) => {
    const date = req.params.date;
    const today = new Date(`${date.substr(0, 4)}/${date.substr(4, 2)}/${date.substr(6, 2)}`);
    const yesterday = new Date(today.setDate(today.getDate() - 1));
    const yDate = yesterday.getFullYear() 
      + ('0' + (yesterday.getMonth()+1)).slice(-2)
      + ('0' + yesterday.getDate()).slice(-2);
    try {
      const stats = fs.lstatSync(`${DBDir}/EVENTS_${yDate}.json`);
      if (stats.isFile()) {
        fs.readFile(`${DBDir}/EVENTS_${yDate}.json`, 'utf-8', (err2, data2) => {
        
          if (err2 || err1) {
            return next(err2);
          }
          try {
            const jdata = JSON.parse(data2).concat(JSON.parse(data1));
            return res.json(jdata);
          } catch (errr2) {
            return next(errr2);
          }
        })
      }
    } catch(e) {
      if (err1) {
        return next(err1);
      }
      try {
        return res.json(JSON.parse(data1));
      } catch (errr1) {
        return next(errr1);
      }
    }
  }); 
});

module.exports = router;
