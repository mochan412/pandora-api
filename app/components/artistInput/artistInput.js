import React, { Component } from 'react';
import styles from './artistInput.css';
import PropTypes from 'prop-types';
import Autocomplete from '../autocomplete/autocomplete.js';
import * as appConstants from '../../constants.js';

class ArtistInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      errorMsg: '',
      autocomplete: {

      }
    }

    this.inputChange = this.inputChange.bind(this);
    this.submitEvent = this.submitEvent.bind(this);
    this.searchArtist = this.searchArtist.bind(this);
  }

  render() {
    let error;
    if (this.state.errorMsg !== '') {
      error = (
        <p className={styles.error}>{this.state.errorMsg}</p>
      )
    }

    return (
      <div className={styles.inputContainer}>
        <div className={styles.inputBox}>
          <input
            type="text"
            value={this.state.value}
            placeholder="Enter an Artist's name"
            onChange={(e)=>this.inputChange(e)} />
            {error}
          <Autocomplete data={this.state.autocomplete} submitArtist={this.props.submitArtist} />
        </div>
        <div className={styles.buttonBox}>
          <button onClick={this.submitEvent} type="submit">submit</button>
        </div>
      </div>
    );
  }

  searchArtist(val) {
    let artistName = val.split(' ').join('+');
    let url = appConstants.apiURL + "/search/v1/artists/?query=" + artistName + "&limit=10";

    fetch(url).then(results => {
      return results.json();
    })
    .then(data => {
      this.setState({
        autocomplete: data
      })
    })
  }

  inputChange(e) {
    this.setState({
      value: e.target.value
    })

    try {
      this.searchArtist(e.target.value);
    } catch(err) {}
  }

  submitEvent() {
    if (this.state.value !== '') {
      this.props.submitArtist(this.state.value);
    } else {
      this.setState({
        errorMsg: 'please enter an artist\'s name'
      })
    }
  }
}

ArtistInput.propTypes = {
  submitArtist: PropTypes.func.isRequired
}

export default ArtistInput;
