const express = require('express');
const router = express.Router();
const fs = require('fs');
const async = require('async');
const logDir = `${__dirname}/../logFiles`;
const DBDir = `${__dirname}/../db`

var obj = {};

//obj['agent'] = 'CSB-i';
//obj['usr'][obj['agent']].push('x');
//console.log(obj);
fs.readdir(logDir, (err, files) => {
  files.forEach ((logFile, i) => {
    fs.readFile(`${logDir}/${logFile}`, 'utf-8', (err, data) => {
        const DB_PATH = `${DBDir}/${logFile.substr(0, logFile.length - 4)}.json`;
        fs.createWriteStream(DB_PATH, {fd: fs.openSync(DB_PATH, 'w'), flags: 'w'}).write('[');
        var sep = "";
        const fileArray = data.split('\n');
        fileArray.forEach((fa) => {
          if (fa.length !== 0) {
            const faa = fa.split(',');
            const eventId = faa[1];
            const messageString = faa[5];
            var agent;
            
            //if (logFile.indexOf('EVENTS_') !== -1) {
              //console.log(agent);
            if (faa[3].indexOf('Cachatto%2F') !== -1 || faa[3].indexOf('Cachatto-ipad/') !== -1) {
              agent = 'CSB-i';
            } else if (faa[3].indexOf('Cachatto-Android') !== -1) {
              agent = 'CSB-A';
            } else if (faa[3].indexOf('Cachatto-Agent') !== -1) {
              agent = 'CSB-W';
            } else if (faa[3].indexOf('CACHATTO%20Desktop%2F') !== -1) {
              agent = 'CDt';
            } else if (faa[3].indexOf('CachattoLoginApp%2F') !== -1) {
              agent = 'LoginApp';
            } else if (faa[3].indexOf('Cachatto-Mac%2F') !== -1) {
              agent = 'Mac';
            } else {
              agent = 'Others';
            };

            if (Object.getOwnPropertyNames(obj).length === 0) {
              obj['usr'] = {'CSB-i':[], 'CSB-A':[], 'CSB-W':[], 'CDt':[], 'LoginApp':[], 'Mac':[], 'Others':[]};
              if (eventId === '10' && messageString.indexOf('successful') !== -1) {
                obj['usr'][agent].push(faa[0]);
              }
            } 
            else {
              if (eventId === '10' && messageString.indexOf('successful') !== -1) {
                if (obj['usr'][agent].indexOf(faa[0]) === -1) {
                  obj['usr'][agent].push(faa[0]);
                }
              } else if (eventId === '85') {
                const iusr = obj['usr'][agent].indexOf(faa[0]);
                if ( iusr !== -1) {
                  obj['usr'][agent].splice(iusr, 1);
                } else {
                  return;
                }
              }
              else {
                return;
              }
            }
            
            obj['time'] = faa[2];
            obj['messageId'] = faa[4];

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

router.get('/:date', function(req, res, next) {
  fs.readdir(DBDir, (err, files) => {
    const dateFiles = [];
    files.forEach((dbfile) => {
      if(dbfile.indexOf(`_${req.params.date}`) !== -1) {
        dateFiles.push(dbfile);
      }
    });
    // if only one file, then show the data of previous day also
    if (dateFiles.length === 1) {
      const today = new Date(`${dateFiles[0].substring(7, 11)}/${dateFiles[0].substring(11, 13)}/${dateFiles[0].substring(13, 15)}`);
      const yesterday = new Date(today.setDate(today.getDate() - 1));
      // convert the date of yesterday to => ex: 20160727
      const yDate = yesterday.getFullYear() 
        + ('0' + (yesterday.getMonth()+1)).slice(-2)
        + ('0' + yesterday.getDate()).slice(-2);
      
        try {
          const stats = fs.lstatSync(`${DBDir}/EVENTS_${yDate}.json`);
          if (stats.isFile()) {
            dateFiles.splice(0, 0, `EVENTS_${yDate}.json`); 
          }
        } catch (e) {};
    }

    function readCallback(err, data) {};

    function readAsync(file, readCallback) {
      fs.readFile(`${DBDir}/${file}`, 'utf-8', readCallback);
    };
    async.map(dateFiles, readAsync, (err, result) => {
      var jdata = [];
      async.each(result, (r) => {
        jdata = jdata.concat(JSON.parse(r));
      }, (err) => {});
      return res.json(jdata);
    })
  });
})
module.exports = router;
