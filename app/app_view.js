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

    this.submitArtist = this.submitArtist.bind(this);
  }

  render() {
    return (
      <div className={styles.app}>
        <h1>Compare Twitter Activity</h1>
        <ArtistInput submitArtist={this.submitArtist}/>

        <ArtistChart activeArtist={this.state.activeArtist} data={this.state.data} size={[900,500]}/>
      </div>
    );
  }

  submitArtist(val) {
    let url = appConstants.apiURL + "/artists/" + val + "/data?metricIds=253,254,255&startDate="+appConstants.startDate+"&endDate="+appConstants.endDate+"&timeseries=totals,deltas&accessToken=" + appConstants.accessToken;

    fetch(url).then(results => {
      return results.json();
    })
    .then(data => {
      this.setState({
        data: data
      })
    })

  }
}
