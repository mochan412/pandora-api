import React from 'react';
import styles from './main.css';

import ArtistInput from './components/artistInput/artistInput.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.app}>
        <ArtistInput />
      </div>
    );
  }
}
