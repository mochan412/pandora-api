Web Engineer Challenge
===
Imagine you have access to 100% of worldwide music consumption data. What would you do with it? How would you visualize it? At Next Big Sound, we spend much of our time thinking about these questions.

We expose and consume data through REST APIs and use that data to create visualizations in the browser. In this challenge, you'll create your own REST API wrapper and an in-browser data visualization.

Your submission should include clear instructions on how to launch your API and data visualization. Other than that, there are no restrictions on the languages, frameworks, or any third-party tools you use.

**Jump to:**
- [Part 1: Create a REST API](#part-1-create-a-rest-api)
- [Part 2: Create a data visualization](#part-2-create-a-data-visualization)
- [APIs to use](#apis-to-use)


Part 1: Create a REST API
---
Using the Next Big Sound [Artist Events API](#artist-events-api), create your own REST API that returns the number of events for an artist over a given date range. The number of events should be returned on a weekly<sup>[1](#foot-1)</sup> basis and broken out by event type<sup>[2](#foot-2)</sup>.


#### Request format
Your API should accept requests in the following format:
```
GET /events/<ARTIST_ID>/stats?startDate=<START_DATE>&endDate=<END_DATE>
```
where:
- `<ARTIST_ID>` is the Next Big Sound ID of an artist
- `<START_DATE>` and `<END_DATE>` are dates in `YYYY-MM-DD` format


#### Response format
API responses should be returned as JSON in the following format:
```json
{
	"counts": {
		"<WEEK_NUMBER>": {
			"<EVENT_TYPE>": <EVENT_COUNT_FOR_WEEK>,
			"<EVENT_TYPE>": <EVENT_COUNT_FOR_WEEK>,
			…
		},
		"<WEEK_NUMBER>": {
			"<EVENT_TYPE>": <EVENT_COUNT_FOR_WEEK>,
			"<EVENT_TYPE>": <EVENT_COUNT_FOR_WEEK>,
			…
		},
		…
	}
}
```
where:
- `<WEEK_NUMBER>` is the ISO 8601 week number<sup>[1](#foot-1)</sup>
- `<EVENT_TYPE>` is the event type<sup>[2](#foot-2)</sup>
- `<EVENT_COUNT_FOR_WEEK>` is the number of events that happened in week `<WEEK_NUMBER>` for `<EVENT_TYPE>` type of events; omit event types with zero counts


#### Example
```
GET /events/356/stats?startDate=2017-01-01&endDate=2017-12-31&accessToken=8c089170d31ea3b11f1ea65dbfc8ea46
```
```json
{
	"counts": {
		"2017-W01": {
			"10": 2,
			"16": 10
		},
		"2017-W02": {
			"10": 4,
			"15": 1,
			"16": 15
		},
		…
		"2017-W52": {
			"15": 6,
			"16": 42
		}
	}
}
```


Part 2: Create a data visualization
---
Using the API you created in part 1 and/or any other [available Next Big Sound APIs](#apis-to-use), create a data visualization using the [D3 JavaScript library](https://d3js.org/). The visualization should be reusable and parameterized to accept different inputs, ideally as an Angular/React/Vue/Ember/etc. component or similar. Be as creative as you'd like!

For ideas and inspiration, see: http://bl.ocks.org/mbostock


APIs to use
---
Most APIs require an API access token to be passed as a `&accessToken` query parameter. You can use this access token:
```
8c089170d31ea3b11f1ea65dbfc8ea46
```


#### Artist Search API
This API returns the artists that match a given name.

```
https://api.nextbigsound.com/search/v1/artists/?query=<NAME>&limit=<LIMIT>
```
where:
- `<NAME>` is the name for which to find matching artists
- `<LIMIT>` is the maximum number of results to return

_Example: Artists matching `kanye west`_
```
https://api.nextbigsound.com/search/v1/artists/?query=kanye+west&limit=10
```


#### Artist Events API
This API returns all the events that occurred for an artist over a given date range.

```
https://api.nextbigsound.com/events/v1/entity/<ARTIST_ID>?start=<START_DAY>&end=<END_DAY>&access_token=<ACCESS_TOKEN>
```
where:
- `<ARTIST_ID>` is the Next Big Sound ID of an artist
- `<START_DAY>` and `<END_DAY>` are day numbers: the number of days since 1970-01-01

_Example: Events for Kanye West (`356`) from 2017-01-01 (`17167`) through 2017-12-31 (`17531`)_
```
https://api.nextbigsound.com/events/v1/entity/356?start=17167&end=17531&access_token=8c089170d31ea3b11f1ea65dbfc8ea46
```


#### Artist Timeseries API
This API returns timeseries data for one or more artist metrics over a given date range.

```
https://api.nextbigsound.com/artists/<ARTIST_ID>/data?metricIds=<METRICS>&startDate=<START_DATE>&endDate=<END_DATE>&timeseries=totals,deltas&accessToken=<ACCESS_TOKEN>
```
where:
- `<ARTIST_ID>` is the Next Big Sound ID of an artist
- `<METRICS>` is a comma-delimited list of metrics IDs
- `<START_DATE>` and `<END_DATE>` are dates in `YYYY-MM-DD` format

_Example: Twitter Followers (`28`) and Twitter Mentions (`247`) for Kanye West (`356`) from 2017-01-01 through 2017-12-31_
```
https://api.nextbigsound.com/artists/356/data?metricIds=28,247&startDate=2017-01-01&endDate=2017-12-31&timeseries=totals,deltas&accessToken=8f6f8a9b1b7c83257922892888218aea
```


#### Metrics API
This API returns metadata about the metrics that Next Big Sound tracks.

_Example: List all metrics_
```
https://api.nextbigsound.com/metrics?fields=items.*&accessToken=8f6f8a9b1b7c83257922892888218aea
```

_Example: Twitter Followers (`28`)_
```
https://api.nextbigsound.com/metrics/28?&accessToken=8f6f8a9b1b7c83257922892888218aea
```

---

<a name="foot-1"><sup>1</sup></a> _Weeks are defined as [ISO 8601 "week dates"](https://en.wikipedia.org/wiki/ISO_8601#Week_dates): `YYYY-Www` where `Www` is the week number prefixed by "W", from `W01` through `W53`._

<a name="foot-2"><sup>2</sup></a> _Event types are as follows:_
```
 1 = Chart Appearance
 2 = Review
 3 = News & Blog Mention
 5 = Shared Link
 6 = Profile Update
 8 = Release
 9 = TV Appearance
10 = Concert
12 = Custom Event
13 = NBS Chart Appearance
14 = NBS Alert
15 = Content Change
16 = Post
17 = Calendar Event
18 = Milestone
19 = Radio Spot
20 = Online Mention
21 = Conference Appearance
22 = TV Advertising
23 = Radio Advertising
24 = Print Advertising
25 = Online Advertising
26 = Mobile Advertising
27 = Email Advertising
28 = Coop
29 = Other
30 = Online Appearance
31 = In-Person Appearance
32 = Interview
33 = Giveaway Promotion
34 = Price Promotion
35 = Mail Advertising
36 = Email Send
37 = Tour
38 = In-house Email
39 = 3rd Party Email
40 = Blog Tour
41 = Sweepstakes/Contests
42 = Social Media Ad/Promo
43 = Social Media Organic
```
