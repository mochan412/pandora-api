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
          <Autocomplete data={this.state.autocomplete} submitArtist={this.submitEvent} />
        </div>
      </div>
    );
  }

  /**
   * get list of artists to pass to AC
   * @val {Number} artist id
   */
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

  /**
   * change event
   * @e {Object} mouse event
   */
  inputChange(e) {
    this.setState({
      value: e.target.value
    })

    try {
      this.searchArtist(e.target.value);
    } catch(err) {}
  }

  /**
   * submit event
   * @id {Number} artist ID
   * @name {String} artist name
   */
  submitEvent(id, name) {
    this.setState({
      value: name
    })
    this.props.submitArtist(id, name);
  }
}

ArtistInput.propTypes = {
  submitArtist: PropTypes.func.isRequired
}

export default ArtistInput;
