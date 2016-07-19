import React, { Component } from 'react';
import dygraph from 'dygraphs';


class Chart extends Component {
  render() {
    const data = this.props.route.data;
    let cData = [];
    data.forEach((d) => {
      if (cData.length === 0 ||
        new Date(d.time).getTime() !== cData[cData.length - 1][0].getTime()) {
        cData.push([new Date(d.time), 1]);
      } else {
        cData[cData.length - 1][1] += 1;
      }
    });
    return (
      <div
        id="chart"
        ref={() => {
          new dygraph(
            document.getElementById('chart'),
            cData,
            {
              title: 'Number of Login users V.S. Time',
              height: 640,
              width: '960',
              labels: ['Time', 'Numbers of Login users'],
              xlabel: 'Time',
              ylabel: 'Number of Login users',
              fillGraph: true,
            }
          );
        }}
      />
    );
  }
}

export default Chart;

