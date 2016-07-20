import React, { Component } from 'react';
import dygraph from 'dygraphs';

class StackedChart extends Component {
  render() {
    const data = this.props.route.data;
    const agents = this.props.route.agents;
    return (
      <div
        id="stackedchart"
        ref={() => {
          const labels = ['Time'];
          agents.forEach((a, i) => {
            labels.push(`usr${i}`);
          });
          new dygraph(
            document.getElementById('stackedchart'),
            data,
            {
              title: 'Number of Login users of different agents V.S. Time',
              height: 640,
              width: 960,
              labels: labels,
              xlabel: 'Time',
              ylabel: 'Number of Login users',
              stackedGraph: true,
              fillGraph: true,
            }
          );
        }}
      />
    );
  
  } 
}

export default StackedChart;
