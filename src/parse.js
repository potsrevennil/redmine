const csv = require('csv-parser');
const fs = require('fs');
const plotly = require('plotly')
const stream = csv({
  raw: false,
  separator: ',',
  quote: '"',
  escape: '"',
  newline: '\n',
  strict: true,
  headers: ['usr', 'status', 'time', 'agent', 'foo', 'bar'],
});

var vData = [];


var parse = fs.createReadStream('../EVENTS_20160601.log')
  .pipe(stream)
  .on('data', (data) => {
    vData.push(data);
  })
  .on('end', () => {
    console.log(vData);
  });
