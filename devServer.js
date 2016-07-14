const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxy = require('proxy-middleware');
const config = require('./webpack.config');

const API_PORT = 3000;

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use('/', proxy(`http://localhost:${API_PORT}/`));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8000, 'localhost', (err) => {
  if (err) {
    return;
  }
});
