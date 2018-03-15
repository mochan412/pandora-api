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

        <ArtistChart  data={this.state.data} size={[700,500]}/>
      </div>
    );
  }

  submitArtist(val) {
    // let url = "/events/" + val + "/stats?startDate=2017-01-01&endDate=2017-12-31&accessToken=" + appConstants.accessToken;
    let url = appConstants.apiURL + "/artists/" + val + "/data?metricIds=28,29,247,415,414,11&startDate="+appConstants.startDate+"&endDate="+appConstants.endDate+"&timeseries=totals,deltas&accessToken=" + appConstants.accessToken;

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
