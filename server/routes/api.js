const express = require('express');
const router = express.Router();
const fs = require('fs');
const async = require('async');
const logDir = `${__dirname}/../logFiles`;
const DBDir = `${__dirname}/../db`

var obj = [];
var usr = {'CSB-i':[], 'CSB-A':[], 'CSB-W':[], 'CDt':[], 'LoginApp':[], 'Mac':[], 'Others':[]};

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
            if (obj.length === 0) {
              obj = [faa[2], 0, 0, 0, 0, 0, 0, 0];
              if (eventId === '10' && messageString.indexOf('successful') !== -1) {
                usr[agent].push(faa[0]);
                Object.keys(usr).forEach((key, i) => {
                  if (key === agent) {
                    obj[i + 1] = usr[agent].length;
                  }
                });
              }
            } 
            else {
              obj[0] = faa[2];
              if (eventId === '10' && messageString.indexOf('successful') !== -1) {
                if (usr[agent].indexOf(faa[0]) === -1) {
                  usr[agent].push(faa[0]);
                  Object.keys(usr).forEach((key, i) => {
                    if (key === agent) {
                      obj[i + 1] = usr[agent].length;
                    }
                  });
                }
              } else if (eventId === '85') {
                const iusr = usr[agent].indexOf(faa[0]);
                if ( iusr !== -1) {
                  usr[agent].splice(iusr, 1);
                  Object.keys(usr).forEach((key, i) => {
                    if (key === agent) {
                      obj[i + 1] = usr[agent].length;
                    }
                  });
                } else {
                  return;
                }
              }
              else {
                return;
              }
            }
            
            //obj['time'] = faa[2];

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

    return res.json(JSON.parse(JSON.stringify(dateFiles)));
  });
})

router.get('/file/:fileName', function(req, res, next) {
  fs.readFile(`${DBDir}/${req.params.fileName}`, 'utf-8', (err, data) => {
    return res.json(JSON.parse(data));
  })

});
module.exports = router;
