import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import dygraph from 'dygraphs';


class Chart extends Component {
  constructor() {
    super();
    this.state = {
      data: [[new Date(0), 0]],
    };
    this.handleClickDay = this.handleClickDay.bind(this);
    this.handleClickMonth = this.handleClickMonth.bind(this);
  }

  handleClickDay() {
    const date = new Date();
    const sDate = date.getFullYear() 
      + ('0' + (date.getMonth()+1)).slice(-2)
      + ('0' + date.getDate()).slice(-2);
    //fetch(`/api/${sDate}`)
    fetch(`/api/20160601`)
      .then(res => res.json())
      .then(data => {
        if (data.length !== 0 ) {
          let cData = [];
          data.forEach((d, i) => {
            if (i === 0 || new Date(d.time).getTime() !== cData[cData.length - 1][0].getTime()) {
              var userNum = 0;
              Object.keys(d.usr).forEach((key) => {
                userNum += d.usr[key].length;
              });
              cData.push([new Date(d.time), userNum]);
            } 
            else {
              var userNum = 0;
              Object.keys(d.usr).forEach((key) => {
                userNum += d.usr[key].length;
              });
              cData[cData.length - 1][1] = userNum;
            }
          });
          this.setState({
            data: cData
          });
        }
      });
  }

  handleClickMonth() {
    const date = new Date();
    const sMonth = date.getFullYear()
      + ('0' + (date.getMonth()+1)).slice(-2);
    //fetch(`/api/${sMonth}`)
    fetch('/api/2016/05')
      .then(res => res.json())
      .then(data => {
        if (data.length !== 0 ) {
          let cData = [];
          data.forEach((d, i) => {
            if (i === 0 || new Date(d.time).getTime() !== cData[cData.length - 1][0].getTime()) {
              var userNum = 0;
              Object.keys(d.usr).forEach((key) => {
                userNum += d.usr[key].length;
              });
              cData.push([new Date(d.time), userNum]);
            } 
            else {
              var userNum = 0;
              Object.keys(d.usr).forEach((key) => {
                userNum += d.usr[key].length;
              });
              cData[cData.length - 1][1] = userNum;
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
        <button style={{width:'120px', height:'60px'}} onClick={this.handleClickDay}>Day</button>
        <button style={{width:'120px', height:'60px'}} onClick={this.handleClickMonth}>Month</button>
      </div>
    );
  }
}

export default Chart;

