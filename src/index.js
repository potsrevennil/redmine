import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';


var  cData = [];
fetch('/api')
  .then(res => res.json())
  .then(data => {
    function compare(d1, d2) {
      const t1 = new Date(d1.time).getTime();
      const t2 = new Date(d2.time).getTime();
      if (t1 > t2)
        return 1;
      else if (t1 < t2)
        return -1;
      else 
        return 0;
    }
    
    data.sort(compare);

    data.forEach( (d) => {
      if (cData.length === 0 || new Date(d.time).getTime() !== cData[cData.length - 1].time.getTime()) {
        cData.push( {time: new Date(d.time), amount: 1} );
      }
      else {
        cData[cData.length - 1].amount += 1;
      }
    });

    render(
      <Chart cData={cData} />,
      document.getElementById('root')
    );
  });

