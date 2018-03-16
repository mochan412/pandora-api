/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const fetch = require('node-fetch')

const port = 3000;
const app = express();

const token         = '8c089170d31ea3b11f1ea65dbfc8ea46';


const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.get('/app', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
  res.end();
});

app.get('/events/:ARTIST_ID/stats', (req, res) => {
    let artist_id   = req.params.ARTIST_ID;
    let start_date  = getEpochDay(req.query.startDate);
    let end_date    = getEpochDay(req.query.endDate);

    let url = "https://api.nextbigsound.com/events/v1/entity/"+artist_id+"?start="+start_date+"&end="+end_date+"&access_token="+token;

    fetch(url).then( response => {
      response.json().then(json => {

        let formattedResponse = formatResponse(json);

        res.json({
          counts: formattedResponse
        })
      });
    })
    .catch( error => {
      console.log('ERROR: ' + error);
    });
});

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

/******** helper functions **********/
/**
 * date formatting - get epoch time by days
 * @date {String} format: yyyy-mm-dd
 */
let getEpochDay = date => {
  let dateArray =  date.split('-');
  let ms = Date.UTC(dateArray[0], dateArray[1]-1, dateArray[2]);
  let newDate = Math.round(ms / 8.64e7);

  return newDate;
}

/**
 * format date - get ISO week
 * @days {Number} epoch time
 */
let getIsoWeek = days => {
  //convert epoch time to milliseconds
  let ms = (days * 86400000)+ 8.64e+7;

  let d = new Date(ms);

  // Set to nearest Thursday per ISO week definition
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  let startDate = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  let weekNo = Math.ceil(( ( (d - startDate) / 86400000) + 1)/7);

  let year = d.getUTCFullYear();

  // pad single digits
  let addPadding = num => {
    return (num < 10 ? '0' : '') + num;
  }

  return (d.getUTCFullYear() + '-W' +  addPadding(weekNo))
}

/**
 * find in array
 * @item {Number, String} number of string (anything that can be validated by === operator)
 * @arr {Array} arry to be traversed
 */
let containsItem = (item, arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == item) {
      return true;
    }
  }

  return false;
}

/**
 * returns events object as key/object pairs
 * @obj {Object}
 */
let returnEvents = obj => {
  let events = {};
  for (let ev in obj) {
    let num = obj[ev].events.length;
    events[ev] = num
  }
  return events;
}

/**
 * iterates over API response and returns formatted object
 * @data {Object}
 */
let formatResponse = data => {
  let values = [],
      result = {};

  for (let item in data) {
    let wk = getIsoWeek(item);
    let eventObj = data[item].event_types;

    if (containsItem(wk, values)) {
      // if it's in a week that's already been counted, add to results object
      let newEvents = returnEvents(eventObj);

      for (let key in newEvents) {
        if (result[wk][key]) {
          result[wk][key] = result[wk][key] + newEvents[key];
        } else {
          result[wk][key] = newEvents[key];
        }
      }
    } else {
      // if it's a new week, add it to values array
      values.push(wk);

      //then add to results object
      result[wk] = returnEvents(eventObj);
    }
  }

  return result;
}
