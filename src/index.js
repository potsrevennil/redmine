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


    render(
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRedirect to="/" />
          <Route path="/chart" component={Chart} data={data} />
          <Route path="/stackedchart" component={StackedChart} data={data} />
        </Route>
      </Router>,
      document.getElementById('root')
    );
  });

