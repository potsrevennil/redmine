import 'babel-polyfill';
import { polyfill } from 'es6-promise';
import fetch from 'isomorphic-fetch';

fetch('/api')
  .then(res => res.json())
  .then(data => {
    console.log(data);
  })
