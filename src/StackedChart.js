import React, { Component } from 'react';
import dygraph from 'dygraphs';

class StackedChart extends Component {
  render() {
    const data = this.props.route.data;
    let cData = [];
    let agents = [];
    data.forEach((d) => {
      if ( cData.length === 0 ) {
        cData.push([new Date(d.time), 1]);
        agents.push(d.agent);
      } 
      else if (new Date(d.time).getTime() !== cData[cData.length - 1][0].getTime()) {
        let noNewAgent = false;
        cData.push(new Array(agents.length + 1));
        cData[cData.length - 1][0] = new Date(d.time);
        agents.forEach((a, i) => {
          if (d.agent === a) {
            cData[cData.length - 1][i + 1] = 1;
            noNewAgent = true;
          } else {
            cData[cData.length - 1][i + 1] = 0;
          }
        });
        if ( !noNewAgent ) {
          cData.forEach((cd) => {
            cd.push(0);
          });
          cData[cData.length - 1][cData[cData.length - 1].length - 1] += 1;
          agents.push(d.agent);
        }
      } 
      else {
        let noNewAgent = false;
        agents.forEach((a, i) => {
          if (d.agent === a) {
            cData[cData.length - 1][i + 1] += 1;
            noNewAgent = true;
          }
        });
        if ( !noNewAgent ) {
          cData.forEach((cd) => {
            cd.push(0);
          });
          cData[cData.length - 1][cData[cData.length - 1].length - 1] += 1;
          agents.push(d.agent);
        }
      }
    });
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
            cData,
            {
              title: 'Number of Login users of different agents V.S. Time',
              height: 640,
              width: 960,
              labels: labels,
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

export default StackedChart;
