import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import React from 'react';
import { render } from 'react-dom';
import { Route, IndexRedirect, Router, browserHistory } from 'react-router';
import Chart from './Chart';
import StackedChart from './StackedChart';


fetch('/api')
  .then(res => res.json())
  .then(data => {
    function compare(d1, d2) {
      const t1 = new Date(d1.time).getTime();
      const t2 = new Date(d2.time).getTime();
      if (t1 > t2) {
        return 1;
      } else if (t1 < t2) {
        return -1;
      }
      return 0;
    }
    data.sort(compare);

    let cData = [];
    let scData = [];
    let agents = [];

    function checkNewAgent(d, noNewAgent) {
      if ( !noNewAgent ) {
        scData.forEach((cd) => {
          cd.push(0);
        });
        scData[scData.length - 1][scData[scData.length - 1].length - 1] += 1;
        agents.push(d.agent);
      }
    }

    data.forEach((d) => {
      if ( scData.length === 0 ) {
        // data for chart
        cData.push([new Date(d.time), 1]);
        // data for stacked chart
        scData.push([new Date(d.time), 1]);
        agents.push(d.agent);
      } else if (new Date(d.time).getTime() !== scData[scData.length - 1][0].getTime()) {
        // data for chart
        cData.push([new Date(d.time), 1]);
        // data for stacked chart
        let noNewAgent = false;
        scData.push(new Array(agents.length + 1));
        scData[scData.length - 1][0] = new Date(d.time);
        agents.forEach((a, i) => {
          if (d.agent === a) {
            scData[scData.length - 1][i + 1] = 1;
            noNewAgent = true;
          } else {
            scData[scData.length - 1][i + 1] = 0;
          }
        });
        checkNewAgent(d, noNewAgent);
      } else {
        // data for chart
        cData[cData.length - 1][1] += 1;
        // data for stacked chart
        let noNewAgent = false;
        agents.forEach((a, i) => {
          if (d.agent === a) {
            scData[scData.length - 1][i + 1] += 1;
            noNewAgent = true;
          }
        });
        checkNewAgent(d, noNewAgent);
      }
    });

    render(
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRedirect to="/" />
          <Route path="/chart" component={Chart} data={cData} />
          <Route path="/stackedchart" component={StackedChart} data={scData} agents={agents}/>
        </Route>
      </Router>,
      document.getElementById('root')
    );
  });

