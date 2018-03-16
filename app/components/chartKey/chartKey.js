import React, { Component } from 'react';
import styles from './chartKey.css';
import * as appConstants from '../../constants.js';

class ChartKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null
    }
  }

  componentWillMount() {

    let url = appConstants.apiURL + "/metrics/" + this.props.code + "?&accessToken=" + appConstants.accessToken;

    fetch(url).then(results => {
      return results.json();
    })
    .then(data => {
      this.setState({
        name: data.fullName
      })
    })
  }

  render() {
    let circleStyle = {
      borderRadius: "50%",
      width:"14px",
      height:"14px",
      backgroundColor: this.props.hex,
      marginRight: '10px'
    }
    return (
      <li className={styles.chartLi}>
        <span style={circleStyle} /> {this.state.name}
      </li>
    )
  }
}

export default ChartKey;
