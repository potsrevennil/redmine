import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import dygraph from 'dygraphs';

class StackedChart extends Component {
  constructor() {
    super()
    this.state = {
      data: [[new Date(0), 0]],
      agents: [''],
      value: ''
    };
    this.handleClickDay = this.handleClickDay.bind(this);
    this.handleClickMonth = this.handleClickMonth.bind(this);
    this.handleClickYear = this.handleClickYear.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick(sDate) {
    fetch(`/api/${sDate}`)
      .then(res => res.json())
      .then(data => {
        let scData = [];
        const agents = ['CSB-i', 'CSB-A', 'CSB-W', 'CDt', 'LoginApp', 'Mac', 'Others'];

        data.forEach((d, i) => {
          if (i === 0 ||
            new Date(d.time).getTime() !== scData[scData.length - 1][0].getTime()) {
            scData.push(new Array(agents.length + 1));
            scData[scData.length - 1][0] = new Date(d.time);
            agents.forEach((a, ia) => {
              scData[scData.length - 1][ia + 1] = d.usr[a].length;
            });
          } 
          else {
            agents.forEach((a, ia) => {
              scData[scData.length - 1][ia + 1] = d.usr[a].length;
            });
          }
        });
        this.setState({
          data: scData,
          agents: agents
        });
      });
  }

  handleClickDay() {
    const date = new Date();
    const sDate = date.getFullYear() 
      + ('0' + (date.getMonth()+1)).slice(-2)
      + ('0' + date.getDate()).slice(-2);
    //this.handleClick(sDate);
    this.handleClick('20160501');
  }

  handleClickMonth() {
    const date = new Date();
    const sDate = date.getFullYear() 
      + ('0' + (date.getMonth()+1)).slice(-2);
    this.handleClick(sDate);
  }


  handleClickYear() {
    const date = new Date();
    const sDate = date.getFullYear(); 
    this.handleClick(sDate);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.handleClick(event.target.value);
      this.setState({value: ''});
    }
  }

  render() {
    const data = this.state.data;
    const agents = this.state.agents;
    const value = this.state.value;
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
        <div>
          <button style={{width:'120px', height:'60px'}} onClick={this.handleClickDay}>Day</button>
          <button style={{width:'120px', height:'60px'}} onClick={this.handleClickMonth}>Month</button>
          <button style={{width:'120px', height:'60px'}} onClick={this.handleClickYear}>Year</button>
        </div>
        <div style={{position: 'relative', top: '20px'}}>
          <input
            style={{height: 50, width: 600, fontSize: '35px'}}
            value= {value}
            placeholder='What date do you want to search ?'
            onChange={this.handleChange}
            onKeyDown={this.handleSubmit}
          />
        </div>
      </div>
    );
  
  } 
}

export default StackedChart;
