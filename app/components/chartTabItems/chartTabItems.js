import React, { Component } from 'react';
import styles from './chartTabItems.css';
import * as appConstants from '../../constants.js';
import cn from 'classnames';

class ChartTabItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: this.props.active
    }

    this.clickHandler = this.clickHandler.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        active: nextProps.active
      })
    }
  }

  render() {
    let activeClass = ""
    if (this.state.active) {
      activeClass = styles.active
    }

    return (
      <li className={cn(styles.tab, activeClass)} onClick={this.clickHandler}>{this.props.title}</li>
    )
  }

  clickHandler() {
    this.props.changeActiveClass(this.props.id);
    this.props.changeMetrics(this.props.values)
  }
}

export default ChartTabItems;
