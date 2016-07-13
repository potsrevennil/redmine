const csv = require('csv-parser');
const fs = require('fs');
const plotly = require('plotly')('potsrevennil', 'uvwz5plcso');
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
const trace = {
  x: [],
  y: [],
  fill: 'tozeroy',
  type: 'scatter',
};


fs.createReadStream('../EVENTS_20160601.log')
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
      hr: vecTime[0],
      min: vecTime[1],
      agent: data.agent,
      foo: data.foo,
      bar: data.bar,
    };
    vData.push(d);
    const t = Number(d.hr) + Number(d.min) / 60;
    if (trace.x.length === 0 || trace.x[trace.x.length - 1] !== t) {
      trace.x.push(t);
      trace.y.push(1);
    } else {
      trace.y[trace.y.length - 1] += 1;
    }
  })
  .on('end', () => {
    const graphOptions = { filename: 'event_20160601.1', fileopt: 'overwrite' };
    plotly.plot(trace, graphOptions, (err, msg) => {
      console.log(msg);
    });
  });
