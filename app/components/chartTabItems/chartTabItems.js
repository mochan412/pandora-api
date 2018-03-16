import React, { Component } from 'react';
import styles from './chartTabItems.css';
import * as appConstants from '../../constants.js';

class ChartTabItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }

    this.clickHandler = this.clickHandler.bind(this)
  }

  render() {

    return (
      <li className={styles.tab} onClick={this.clickHandler}>{this.props.title}</li>
    )
  }

  clickHandler() {
    this.props.changeMetrics(this.props.values)
  }
}

export default ChartTabItems;
