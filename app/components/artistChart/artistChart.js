import React, { Component } from 'react';
import styles from './artistChart.css';
import PropTypes from 'prop-types';
import * as appConstants from '../../constants.js';
import * as d3 from 'd3';

import ChartKey from '../chartKey/chartKey.js';
import ChartTabs from '../chartTabs/chartTabs.js';


class ArtistChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showIndex: false,
      chartKeys: null,
      activeTab: 1
    }

    this.createIndex = this.createIndex.bind(this);
    this.createChart = this.createChart.bind(this);
    this.initLoad = this.initLoad.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.state = {
        showIndex: false,
        chartKeys: null
      }
      this.createChart(nextProps.data);
    }

    if (this.props.activeArtist !== nextProps.activeArtist) {
      this.state = {
        activeTab: 1
      }
    }
  }

  render() {
    let chartTabs = null;
    if (this.state.showIndex) {
      chartTabs = (
        <ChartTabs changeMetrics={this.props.changeMetrics} initLoad={this.initLoad} activeTab={this.state.activeTab}/>
      )
    }

    return (
      <div className={styles.chartContainer}>
        {this.state.chartKeys}
        {chartTabs}
        <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}>
        </svg>
      </div>
    )
  }

  createIndex(arr) {
    let keyItems = arr.map((item, i)=>{
        return <ChartKey hex={item.hex} key={i} code={item.id} />
    })

    let key = (
      <ul className={styles.keyBox}>
        {keyItems}
      </ul>
    )
    this.setState({
      showIndex: true,
      chartKeys: key
    })
  }

  createChart(data) {

    const svg = d3.select(this.node);
    const width = this.props.size[0];
    const height = this.props.size[1];
    const padding = 40;

    svg.selectAll("*").remove();

    let returnDeltas = (deltas) => {
      let deltasArray = [];
      for (let d in deltas) {
        let newDateArr = d.split('-');
        let newDate = new Date(newDateArr[0], newDateArr[1]-1, newDateArr[2] )
        let newObj = {};
        newObj['x'] = newDate;
        newObj['y'] = deltas[d]
        deltasArray.push(newObj)
      }

      return deltasArray;
    }

    let returnKeys = arr => {
      let newArr = arr.map(item=>{
        return item.y
      })
      return newArr
    }

    let data2 = data.data.map(item => {
      return {
        metricId: item.metricId,
        values: returnDeltas(item.timeseries.deltas)
      }
    })

    let returnDate = arr => {
      let newArr = arr.map(item=>{
        return item.x
      })
      return newArr
    }

    let scaleX = d3.scaleTime()
        .domain([
          d3.min(data2, d => { return d3.min(returnDate(d.values)) }),
          d3.max(data2, d => { return d3.max(returnDate(d.values)) })
        ])
        .range([padding, width]);

    let scaleY = d3.scaleLinear()
        .domain([
          d3.min(data2, d => { return d3.min(returnKeys(d.values)) }),
          d3.max(data2, d => { return d3.max(returnKeys(d.values)) })
        ])
        .range([height - padding, 0]);


    let color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(d3.keys(data2[0]).filter(function(key) { return key === "metricId"; }));

    var  num_format = d3.format('.2s');

    let xAxis = d3.axisBottom(scaleX);
    let yAxis = d3.axisLeft(scaleY).ticks(10)
        .tickFormat(num_format);

    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate("+padding+",0)")
        .call(yAxis);

    svg.selectAll(".xAxis text")
          .attr("transform", function(d) {
          return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
        });

    svg.selectAll(".yAxis text")

    let lines = svg.selectAll(".lines")
        .data(data2)
        .enter().append("g")
        .attr("class", "lines");

    let lineFunction = d3.line()
      .x(function(d) { return scaleX(d.x); })
      .y(function(d) { return scaleY(d.y); });

    lines.append("path")
        .attr("class", "line")
        .attr("d", d => { return lineFunction(d.values)})
        .style("stroke", function(d) { return color(d.metricId); })
        .style("fill", "none");

    let index = data2.map(item => {
      return {id: item.metricId, hex: color(item.metricId)}
    })

    this.createIndex(index);
  }

  initLoad() {
    const svg = d3.select(this.node);
    svg.selectAll("*").remove();

    this.setState({
      loading: true
    })
  }
}

export default ArtistChart;
