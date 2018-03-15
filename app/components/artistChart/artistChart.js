import React, { Component } from 'react';
import styles from './artistChart.css';
import PropTypes from 'prop-types';
import * as appConstants from '../../constants.js';
import * as d3 from 'd3';

const JSON = {"counts":{"2017-W01":{"16":7},"2017-W02":{"16":10},"2017-W03":{"16":13},"2017-W04":{"16":12},"2017-W05":{"16":12},"2017-W06":{"8":8,"15":2,"16":140},"2017-W07":{"15":3,"16":54},"2017-W08":{"15":4,"16":63},"2017-W09":{"16":39},"2017-W10":{"16":35},"2017-W11":{"8":1,"16":17},"2017-W12":{"8":4,"16":29},"2017-W13":{"16":38},"2017-W14":{"15":4,"16":37},"2017-W15":{"8":2,"16":58},"2017-W16":{"16":35},"2017-W17":{"8":1,"15":2,"16":149},"2017-W18":{"16":42},"2017-W19":{"15":3,"16":131},"2017-W20":{"8":4,"15":4,"16":105},"2017-W21":{"10":1,"15":6,"16":72},"2017-W22":{"15":1,"16":36},"2017-W23":{"8":10,"10":1,"15":38,"16":146},"2017-W24":{"8":1,"15":26,"16":198},"2017-W25":{"10":1,"15":1,"16":8},"2017-W26":{"8":2,"15":3,"16":42},"2017-W27":{"15":2,"16":8},"2017-W28":{"15":3,"16":14},"2017-W29":{"16":29},"2017-W30":{"16":27},"2017-W31":{"16":22},"2017-W32":{"16":15},"2017-W33":{"16":19},"2017-W34":{"8":1,"15":5,"16":38},"2017-W35":{"15":1,"16":22},"2017-W36":{"10":2,"16":15},"2017-W37":{"10":1,"15":3,"16":27},"2017-W38":{"10":3,"16":49},"2017-W39":{"8":1,"10":4,"15":1,"16":15},"2017-W40":{"10":2,"16":17},"2017-W41":{"10":4,"16":17},"2017-W42":{"10":2,"15":2,"16":14},"2017-W43":{"10":4,"16":15},"2017-W44":{"10":2,"16":16},"2017-W45":{"10":3,"15":1,"16":10},"2017-W46":{"10":1,"16":18},"2017-W47":{"10":1,"16":16},"2017-W48":{"10":5,"16":23},"2017-W49":{"10":4,"16":11},"2017-W50":{"10":3,"16":23},"2017-W51":{"10":2,"14":4,"15":2,"16":46},"2017-W52":{"16":3}}}


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

    let parseTime = d3.timeParse("%y-%d-%m");

    let returnDelta = (deltas) => {
      let deltasArray = [];
      for (let d in deltas) {
        let newObj = {};
        newObj[d] = deltas[d]
        deltasArray.push(newObj)
      }
      return deltasArray;
    }

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
      }
    })

    let data2 = data.data.map(item => {
      return {
        metricId: item.metricId,
        values: returnDeltas(item.timeseries.deltas)
      }
    })

    let returnDate = arr => {
      let newArr = arr.map(item=>{
        for (let i in item) {
          let dateArr = i.split('-');
          return new Date(dateArr[0],dateArr[1]-1,dateArr[2]);
        }
      })
      return newArr
    }

    let scaleX = d3.scaleTime().domain([
          d3.min(formattedData, d => { return d3.min(returnDate(d.values)) }),
          d3.max(formattedData, d => { return d3.max(returnDate(d.values)) })
        ])
        .range([padding, width - padding * 2]);

    let scaleY = d3.scaleLinear().domain([
          d3.min(formattedData, d => { return d3.min(returnKeys(d.values)) }),
          d3.max(formattedData, d => { return d3.max(returnKeys(d.values)) })
        ])
        .range([height, 0]);


    let color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(d3.keys(formattedData[0]).filter(function(key) { return key === "metricId"; }));

    let xAxis = d3.axisBottom(scaleX);
    let yAxis = d3.axisLeft(scaleY).ticks(10);

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


      lines.append("text")
          .datum(function(d) { return {name: d.name, length: d.values.length-1, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d, i) { return "translate(" + x(d.length) + "," + y(d.value) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });
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
