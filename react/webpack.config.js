var path = require('path'),
    webpack = require('webpack');


var BUILD_DIR = path.resolve(__dirname, '../static/js');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
  entry: {
    app_view: APP_DIR + '/app_view.jsx'
  },
  output: {
    path: BUILD_DIR,
    filename: "[name].bundle.js"
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        include: APP_DIR + '/data',
        loader: 'json-loader',
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;