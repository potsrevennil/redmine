import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import React from 'react';
import { render } from 'react-dom';
import { Route, IndexRedirect, Router, browserHistory } from 'react-router';
import Chart from './Chart';
import StackedChart from './StackedChart';

    render(
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRedirect to="/" />
          <Route path="/chart" component={Chart} />
          <Route path="/stackedchart" component={StackedChart} />
        </Route>
      </Router>,
      document.getElementById('root')
    );
  //});

