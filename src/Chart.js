import React, { Component } from 'react';
import dygraph from 'dygraphs';


class Chart extends Component {
  render() {
    const data = this.props.route.data;
    return (
      <div
        id="chart"
        ref={() => {
          new dygraph(
            document.getElementById('chart'),
            data,
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

