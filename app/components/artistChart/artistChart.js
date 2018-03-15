import React, { Component } from 'react';
import styles from './artistChart.css';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { select } from 'd3-selection';

class ArtistChart extends Component {
  constructor(props) {
    super(props);

    this.createLine = this.createLine.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      nextProps.data.data.map(item => {
        this.createLine(item.timeseries.totals)
      })
    }
  }


  render() {
    return (
      <div className={styles.chartContainer}>
        <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}>
        </svg>
      </div>
    )
  }

  createLine(data) {
    let dataArray = [];
    for (let i in data) {
      dataArray.push(data[i])
    }

    const node = this.node;
    const svg = select(node);

    let width = this.props.size[0];
    let height = this.props.size[1];

    let x = scaleLinear().rangeRound([0, width]);
    let y = scaleLinear().rangeRound([height, 0]);

    if (dataArray.length > 0) {
      x.domain([0, dataArray.length]);
      y.domain([-16, 16]);

      let drawAxis = function(yValueCallback, color) {
            svg.append('path')
                .datum(dataArray)
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 5)
                .attr("d", line().x(function(d) { return x(d.t); }).y(yValueCallback));
      };

      // drawAxis(function(d) { return y(d.x); }, "blue");
      // drawAxis(function(d) { return y(d.y); }, "red");
      // drawAxis(function(d) { return y(d.z); }, "green");

    }


  }

  createBarChart(res) {
   //  const node = this.node
   //  const dataMax = max(res.data)
   //  const yScale = scaleLinear()
   //    .domain([0, dataMax])
   //    .range([0, this.props.size[1]])
   // select(node)
   //    .selectAll('rect')
   //    .data(this.props.data)
   //    .enter()
   //    .append('rect')
   //
   // select(node)
   //    .selectAll('rect')
   //    .data(this.props.data)
   //    .exit()
   //    .remove()
   //
   // select(node)
   //    .selectAll('rect')
   //    .data(this.props.data)
   //    .style('fill', '#cccdd2')
   //    .attr('x', (d,i) => i * 25)
   //    .attr('y', d => this.props.size[1] - yScale(d))
   //    .attr('height', d => yScale(d))
   //    .attr('width', 25)
   }
}

export default ArtistChart;
