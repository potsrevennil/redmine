import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import dygraph from 'dygraphs';


class Chart extends Component {
  constructor() {
    super();
    this.state = {
      data: [[new Date(0), 0]],
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const date = new Date();
    const sDate = date.getFullYear() 
      + ('0' + (date.getMonth()+1)).slice(-2)
      + ('0' + date.getDate()).slice(-2);
    //fetch(`/api/${sDate}`)
    fetch(`/api/20160419`)
      .then(res => res.json())
      .then(data => {
        if (data.length !== 0 ) {
          let cData = [];
          data.forEach((d, i) => {
            if (i === 0) {
              cData.push([new Date(d.time), d.usr.length]);
            } 
            else if (new Date(d.time).getTime() !== cData[cData.length - 1][0].getTime()) {
              cData.push([new Date(d.time), d.usr.length]);
            } 
            else {
              cData[cData.length - 1][1] = d.usr.length;
            }
          });
          this.setState({
            data: cData
          });
        }
      });
  }

  render() {
    const data = this.state.data;
    console.log(data);
    return (
      <div>
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
        <button style={{width:'120px', height:'60px'}} onClick={this.handleClick}>day</button>
      </div>
    );
  }
}

export default Chart;

