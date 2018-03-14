'use strict';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    fetch = require('node-fetch'),
    router = express.Router();

var token = '8c089170d31ea3b11f1ea65dbfc8ea46';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

router.get('/events/:ARTIST_ID/stats', function (req, res) {
  var artist_id = req.params.ARTIST_ID;
  var start_date = getEpochDay(req.query.startDate);
  var end_date = getEpochDay(req.query.endDate);

  var url = "https://api.nextbigsound.com/events/v1/entity/" + artist_id + "?start=" + start_date + "&end=" + end_date + "&access_token=" + token;

  fetch(url).then(function (response) {
    response.json().then(function (json) {

      var formattedResponse = formatResponse(json);

      res.json({
        counts: formattedResponse
      });
    });
  }).catch(function (error) {
    console.log('ERROR: ' + error);
  });
});

router.get('/home', function (req, res) {
  res.send('static');
});

app.use('/', router);

app.listen(port);
console.log('API server started on port ' + port);

/******** helper functions **********/
//date formatting - get epoch time by day
var getEpochDay = function getEpochDay(date) {
  var dateArray = date.split('-');
  var ms = Date.UTC(dateArray[0], dateArray[1] - 1, dateArray[2]);
  var newDate = Math.round(ms / 8.64e7);

  return newDate;
};

//format date - get ISO week
var getIsoWeek = function getIsoWeek(days) {
  //convert epoch time to milliseconds
  var ms = days * 86400000 + 8.64e+7;

  var d = new Date(ms);

  // Set to nearest Thursday per ISO week definition
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var startDate = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil(((d - startDate) / 86400000 + 1) / 7);

  var year = d.getUTCFullYear();

  // pad single digits
  var addPadding = function addPadding(num) {
    return (num < 10 ? '0' : '') + num;
  };

  return d.getUTCFullYear() + '-W' + addPadding(weekNo);
};

//find in array
var containsItem = function containsItem(item, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      return true;
    }
  }

  return false;
};

//returns events object as key/object pairs
var returnEvents = function returnEvents(obj) {
  var events = {};
  for (var ev in obj) {
    var num = obj[ev].events.length;
    events[ev] = num;
  }
  return events;
};

//iterates over API response and returns formatted object
var formatResponse = function formatResponse(data) {
  var values = [],
      result = {};

  for (var item in data) {
    var wk = getIsoWeek(item);
    var eventObj = data[item].event_types;

    if (containsItem(wk, values)) {
      // if it's in a week that's already been counted, add to results object
      var newEvents = returnEvents(eventObj);

      for (var key in newEvents) {
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
};