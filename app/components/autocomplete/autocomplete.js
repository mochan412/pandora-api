import React, { Component } from 'react';
import styles from './autocomplete.css';
import PropTypes from 'prop-types';
import _ from 'lodash';

class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artists: []
    }

    this.selectChild = this.selectChild.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.artists && !_.isEqual(this.props.data, nextProps.data)) {
      this.setState({
        artists: nextProps.data.artists
      })
    }
  }

  render() {

    let acChildren = null;
    if (this.state.artists.length > 0) {
      let children = this.state.artists.map((item, index) => {

        return (<li onClick={() => this.selectChild(item.id, item.name)} key={index}>{item.name}</li>)
      })

      acChildren = <ul className={styles.acList}>{children}</ul>
    }

    return (
      <div className={styles.acBox}>
        {acChildren}
      </div>
    );
  }

  // TODO: enable keyboard events
  selectChild(id, name) {
    this.setState({
      artists: []
    });

    try {
      this.props.submitArtist(id, name);
    } catch(err) {}
  }
}

Autocomplete.propTypes = {
  submitArtist: PropTypes.func.isRequired
}

export default Autocomplete;
