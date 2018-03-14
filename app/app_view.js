import React from 'react';
import styles from './main.css';

import ArtistInput from './components/artistInput/artistInput.js';
import ArtistChart from './components/artistChart/artistChart.js';

import * as appConstants from './constants.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    }

    this.submitArtist = this.submitArtist.bind(this);
  }

  render() {
    return (
      <div className={styles.app}>
        <ArtistInput submitArtist={this.submitArtist}/>

        <ArtistChart  data={[5,10,1,3]} size={[500,500]}/>
      </div>
    );
  }

  submitArtist(val) {
    let url = appConstants.apiURL + "/artists/" + val + "/data?metricIds=31,37&&startDate=2017-01-01&endDate=2017-12-31&timeseries=totals,deltas&accessToken=" + appConstants.accessToken;

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
