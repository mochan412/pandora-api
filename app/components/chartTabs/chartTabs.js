import React, { Component } from 'react';
import styles from './chartTabs.css';
import * as appConstants from '../../constants.js';

import ChartTabItems from '../chartTabItems/chartTabItems.js';

class ChartTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabItems: [
          {values: [11,31,40,254], title: "likes", id: 1},
          {values: [42,44,74,41,411,415], title: "plays/views", id: 2},
          {values: [28,37,256,405], title: "followers", id: 3}
        ],
      activeItem: 1
    }

    this.changeActiveClass = this.changeActiveClass.bind(this);
  }

  render() {
    let items = this.state.tabItems.map((item, i) => {
      if (this.state.activeItem == item.id) {
        return <ChartTabItems
          id={item.id}
          values={item.values}
          title={item.title}
          key={i}
          changeMetrics={this.props.changeMetrics}
          changeActiveClass={this.changeActiveClass}
          active={true} />
      } else {
        return <ChartTabItems
          id={item.id}
          values={item.values}
          title={item.title}
          key={i}
          changeMetrics={this.props.changeMetrics}
          changeActiveClass={this.changeActiveClass}
          active={false} />
      }
    })

    return (
      <ul className={styles.chartTabs}>
        {items}
      </ul>
    )
  }

  changeActiveClass(id) {
    console.log(id)
    this.setState({
      activeItem: id
    })
  }
}

export default ChartTabs;
