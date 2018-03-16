import React, { Component } from 'react';
import styles from './chartTabs.css';
import * as appConstants from '../../constants.js';

import ChartTabItems from '../chartTabItems/chartTabItems.js';

class ChartTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentWillMount() {

  }

  render() {

    return (
      <ul className={styles.chartTabs}>
        <ChartTabItems values={[11,31,40,254]} title="likes" changeMetrics={this.props.changeMetrics} />
        <ChartTabItems values={[42,44,74,41,411,415]} title="plays/views" changeMetrics={this.props.changeMetrics} />
        <ChartTabItems values={[28,37,256,405]} title="followers" changeMetrics={this.props.changeMetrics} />
      </ul>
    )
  }
}

export default ChartTabs;
