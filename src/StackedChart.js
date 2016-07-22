import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import dygraph from 'dygraphs';

class StackedChart extends Component {
  constructor() {
    super()
    this.state = {
      data: [[new Date(0), 0]],
      agents: [''],
    };
    this.handleClick = this.handleClick.bind(this);

  }


  handleClick() {
    const date = new Date();
    const sDate = date.getFullYear() 
      + ('0' + (date.getMonth()+1)).slice(-2)
      + ('0' + date.getDate()).slice(-2);
    //fetch(`/api/${sDate}`)
    fetch(`/api/20160420`)
      .then(res => res.json())
      .then(data => {
        let scData = [];
        const agents = ['CSB-i', 'CSB-A', 'CSB-w', 'CDt', 'LoginApp for Windows', 'Mac', 'Others'];
        //function checkNewAgent(d, dPrev, noNewAgent) {
          //if ( !noNewAgent ) {
            //scData.forEach((cd) => {
              //cd.push(0);
            //});
            //scData[scData.length - 1][scData[scData.length - 1].length - 1] = d.usr.length - dPrev.usr.length;
            //agents.push(d.agent);
          //}
        //}

        data.forEach((d, i) => {
          if (i === 0) {
            scData.push(new Array(agents.length + 1));
            scData[scData.length - 1][0] = new Date(d.time);
            agents.forEach((a, ia) => {
              if (d.agent === a) {
                scData[scData.length - 1][ia + 1] = d.usr.length;
              } else {
                scData[scData.length - 1][ia + 1] = 0;
              }
            });
            //scData.push([new Date(d.time), d.usr.length]);
            //agents.push(d.agent);
          } else if (new Date(d.time).getTime() !== scData[scData.length - 1][0].getTime()) {
            //let noNewAgent = false;
            scData.push(new Array(agents.length + 1));
            scData[scData.length - 1][0] = new Date(d.time);
            agents.forEach((a, ia) => {
              scData[scData.length - 1][ia + 1] = scData[scData.length - 2][ia + 1];
              if (d.agent === a) {
                scData[scData.length - 1][ia + 1] += d.usr.length - data[i - 1].usr.length; // new users + users' num of previous time
                //noNewAgent = true;
              }
            });
            //checkNewAgent(d, data[i - 1], noNewAgent);
          } 
          else {
            //let noNewAgent = false;
            agents.forEach((a, ia) => {
              if (d.agent === a) {
                scData[scData.length - 1][ia + 1] += d.usr.length - data[i - 1].usr.length;
                //noNewAgent = true;
              }
            });
            //checkNewAgent(d, data[i - 1], noNewAgent);
          }
        });
        this.setState({
          data: scData,
          agents: agents
        });
      });
  }

  render() {
    const data = this.state.data;
    const agents = this.state.agents;
    return (
      <div>
        <div
          id="stackedchart"
          ref={() => {
            const labels = ['Time'];
            agents.forEach((a, i) => {
              labels.push(a);
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
        <button style={{width:'120px', height:'60px'}} onClick={this.handleClick}>day</button>
      </div>
    );
  
  } 
}

export default StackedChart;
