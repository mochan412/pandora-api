import React, { Component } from 'react';
import styles from './artistChart.css';
import PropTypes from 'prop-types';
import * as appConstants from '../../constants.js';
import * as d3 from 'd3';

class ArtistChart extends Component {
  constructor(props) {
    super(props);

    this.createChart = this.createChart.bind(this);
    this.createLine = this.createLine.bind(this);
  }

  componentDidMount() {
    // this.createChart();
  }

  componentWillMount() {
    // this.createChart();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.createChart(nextProps.data);
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

  createChart(data) {

    const svg = d3.select(this.node);
    const width = this.props.size[0];
    const height = this.props.size[1];
    const padding = 40;
    const startDate = appConstants.startDate.split('-');
    const endDate = appConstants.endDate.split('-');

    let returnDelta = (deltas) => {
      let deltasArray = [];
      for (let d in deltas) {
        let newObj = {};
        newObj[d] = deltas[d]
        deltasArray.push(newObj)
      }
      return deltasArray;
    }

    let returnKeys = arr => {
      let newArr = arr.map(item=>{
        for (let i in item) {
          return item[i]
        }
      })
      return newArr
    }

    let formattedData = data.data.map(item => {
      return {
        metricId: item.metricId,
        values: returnDelta(item.timeseries.deltas)
        // values: item.timeseries.deltas
      }
    })

    console.log(formattedData)

    let returnDate = arr => {
      let newArr = arr.map(item=>{
        for (let i in item) {
          let dateArr = i.split('-');
          return new Date(dateArr[0],dateArr[1]-1,dateArr[2]);
          // return i
        }
      })
      return newArr
    }
    //
    // let minDate = new Date(startDate[0],startDate[1]-1,startDate[2]),
    //     maxDate = new Date(endDate[0],endDate[1]-1,endDate[2]);
    //


    // let x = d3.scaleTime().domain([minDate, maxDate])
    //     .range([padding, width - padding * 2]);

    let axisX = d3.scaleTime().domain([
          d3.min(formattedData, d => { return d3.min(returnDate(d.values)) }),
          d3.max(formattedData, d => { return d3.max(returnDate(d.values)) })
        ])
        .range([padding, width - padding * 2]);

    let axisY = d3.scaleLinear().domain([
          d3.min(formattedData, d => { return d3.min(returnKeys(d.values)) }),
          d3.max(formattedData, d => { return d3.max(returnKeys(d.values)) })
        ])
        .range([height, 0]);


    let color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(d3.keys(formattedData[0]).filter(function(key) { return key === "metricId"; }));

    let xAxis = d3.axisBottom(axisX);
    let yAxis = d3.axisLeft(axisY).ticks(10);

    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate("+padding+",0)")
        .call(yAxis);

    svg.selectAll(".xAxis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
          return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
        });

      // var data = [
//     {name: 'John', values: [0,1,3,9, 8, 7]},
//     {name: 'Harry', values: [0, 10, 7, 1, 1, 11]},
//     {name: 'Steve', values: [3, 1, 4, 4, 4, 17]},
//     {name: 'Adam', values: [4, 77, 2, 13, 11, 13]}
// ];
      let x = d3.scaleTime()
          // .domain([
            // d3.min(data, d => { return d3.min(returnDate(d.values)) }),
            // d3.max(data, d => { return d3.max(returnDate(d.values)) })
          // ])
          .range([padding, width - padding * 2]);

      let y = d3.scaleLinear()
          // .domain([
          //   d3.min(data, d => { return d3.min(returnKeys(d.values)) }),
          //   d3.max(data, d => { return d3.max(returnKeys(d.values)) })
          // ])
          .range([height, 0]);

      let line = d3.line()
          .x(function(d, i) {
            let val = 0;
            for (let i in d) {
              val = d[i]
            };
            return x(val); })
          .y(function(d, i) {
            // let val = null;
            // for (let i in d) {
            //   let dateArr = i.split('-');
            //   val = new Date(dateArr[0],dateArr[1]-1,dateArr[2]);
            // };
            console.log(d, i)
            return y(i); })
          .curve(d3.curveBasis)

      var people = svg.selectAll(".people")
          .data(formattedData)
          .enter().append("g")
          .attr("class", "people");

      people.append("path")
          .attr("class", "line")
          .attr("d", d => { return line(d.values); })
          .style("stroke", function(d) { return color(d.metricId); });


      // people.append("text")
      //     .datum(function(d) { return {name: d.name, length: d.values.length-1, value: d.values[d.values.length - 1]}; })
      //     .attr("transform", function(d, i) { return "translate(" + x(d.length) + "," + y(d.value) + ")"; })
      //     .attr("x", 3)
      //     .attr("dy", ".35em")
      //     .text(function(d) { return d.name; });
  }

  createLine(data) {

    const svg = d3.select(this.node),
          margin = {top: 20, right: 80, bottom: 30, left: 50},
          width = svg.attr("width") - margin.left - margin.right,
          height = svg.attr("height") - margin.top - margin.bottom,
          g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let parseTime = d3.timeParse("%Y%m%d");

    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.temperature); });




  }

  createBarChart(data) {
    const svg = d3.select(this.node);
    let margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   var parseTime = d3.timeParse("%Y%m%d");

   var x = d3.scaleTime().range([0, width]),
       y = d3.scaleLinear().range([height, 0]),
       z = d3.scaleOrdinal(d3.schemeCategory10);

   var line = d3.line()
       .curve(d3.curveBasis)
       .x(function(d) { return x(d.date); })
       .y(function(d) { return y(d.temperature); });

   // d3.tsv("data.tsv", type, function(error, data) {
   //   if (error) throw error;
   //
   //   var cities = data.columns.slice(1).map(function(id) {
   //     return {
   //       id: id,
   //       values: data.map(function(d) {
   //         return {date: d.date, temperature: d[id]};
   //       })
   //     };
   //   });
   //
   //   x.domain(d3.extent(data, function(d) { return d.date; }));
   //
   //   y.domain([
   //     d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
   //     d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
   //   ]);
   //
   //   z.domain(cities.map(function(c) { return c.id; }));
   //
   //   g.append("g")
   //       .attr("class", "axis axis--x")
   //       .attr("transform", "translate(0," + height + ")")
   //       .call(d3.axisBottom(x));
   //
   //   g.append("g")
   //       .attr("class", "axis axis--y")
   //       .call(d3.axisLeft(y))
   //     .append("text")
   //       .attr("transform", "rotate(-90)")
   //       .attr("y", 6)
   //       .attr("dy", "0.71em")
   //       .attr("fill", "#000")
   //       .text("Temperature, ºF");
   //
   //   var city = g.selectAll(".city")
   //     .data(cities)
   //     .enter().append("g")
   //       .attr("class", "city");
   //
   //   city.append("path")
   //       .attr("class", "line")
   //       .attr("d", function(d) { return line(d.values); })
   //       .style("stroke", function(d) { return z(d.id); });
   //
   //   city.append("text")
   //       .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
   //       .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
   //       .attr("x", 3)
   //       .attr("dy", "0.35em")
   //       .style("font", "10px sans-serif")
   //       .text(function(d) { return d.id; });
   // });
   //
   // function type(d, _, columns) {
   //   d.date = parseTime(d.date);
   //   for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
   //   return d;
   // }

   }
}

export default ArtistChart;
