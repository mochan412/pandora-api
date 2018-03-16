import React from 'react';
import styles from './main.css';

import ArtistInput from './components/artistInput/artistInput.js';
import ArtistChart from './components/artistChart/artistChart.js';

import * as appConstants from './constants.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      activeArtist: ''
    }

    this.changeMetrics = this.changeMetrics.bind(this);
    this.submitArtist = this.submitArtist.bind(this);
  }

  render() {
    return (
      <div className={styles.app}>
        <h1>Compare Metrics</h1>
        <ArtistInput submitArtist={this.submitArtist}/>
        <ArtistChart
          activeArtist={this.state.activeArtist}
          data={this.state.data}
          changeMetrics={this.changeMetrics}
          size={[900,500]}/>
      </div>
    );
  }

/**
 * API request for different metrics
 * @metrics {Array} array of numbers
 */
 changeMetrics(metrics) {
   let metricsString = metrics.join(',')
   let url = appConstants.apiURL + "/artists/" + this.state.activeArtist + "/data?metricIds="+metricsString+"&startDate="+appConstants.startDate+"&endDate="+appConstants.endDate+"&timeseries=totals,deltas&accessToken=" + appConstants.accessToken;
   fetch(url).then(results => {
     return results.json();
   })
   .then(data => {
     this.setState({
       data: data
     })
   })
 }

 /**
  * API request for different artists
  * @val {Number} artist ID
  */
  submitArtist(val) {
    let url = appConstants.apiURL + "/artists/" + val + "/data?metricIds=11,31,40,254&startDate="+appConstants.startDate+"&endDate="+appConstants.endDate+"&timeseries=totals,deltas&accessToken=" + appConstants.accessToken;

    fetch(url).then(results => {
      return results.json();
    })
    .then(data => {
      this.setState({
        activeArtist: val,
        data: data
      })
    })
  }
}
