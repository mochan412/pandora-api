import React, { Component } from 'react';
import styles from './chartKey.css';
import * as appConstants from '../../constants.js';

class ChartKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      code: null
    }

    this.fetchNew = this.fetchNew.bind(this);
  }

  componentWillMount() {
    this.fetchNew(this.props.code);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.fetchNew(nextProps.code);
    }
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

  fetchNew(code) {
    let url = appConstants.apiURL + "/metrics/" + code + "?&accessToken=" + appConstants.accessToken;

    fetch(url).then(results => {
      return results.json();
    })
    .then(data => {
      this.setState({
        name: data.fullName
      })
    })
  }
}

export default ChartKey;
