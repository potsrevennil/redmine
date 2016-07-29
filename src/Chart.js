import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import dygraph from 'dygraphs';
import async from 'async';
import update from 'react-addons-update';


class Chart extends Component {
  constructor() {
    super();
    this.state = {
      data: [[new Date(0), 0]],
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
    var concatData = [];
    fetch(`/api/${sDate}`)
      .then(res => res.json())
      .then(files => {
        async.map(files, function(item, callback) {
          fetch(`/api/file/${item}`)
            .then(res => res.json())
            .then(data => {
              var cData = [];
              data.forEach((d, i) => {
                var usrNum = 0;
                d.forEach((ud, ui) => {
                  if (ui !== 0) {
                    usrNum += ud;
                  }
                })
                if (i !== 0) {
                  if (new Date(d[0]).getTime() === cData[cData.length - 1][0].getTime()) {
                    cData.pop();
                  }
                }
                cData.push([new Date(d[0]), usrNum]);
              })
              callback(null, cData);
            });
        }, function(err, result) {
          async.each(result, (r) => {
            concatData = concatData.concat(r);
          }, (err) => {});
          this.setState({
            data: update(this.state.data, {$set: concatData}),
          })
        }.bind(this));
      })
    }

  handleClickDay() {
    const date = new Date();
    const sDate = date.getFullYear() 
      + ('0' + (date.getMonth()+1)).slice(-2)
      + ('0' + date.getDate()).slice(-2);
    this.handleClick('20160419');
  }

  handleClickMonth() {
    const date = new Date();
    const sMonth = date.getFullYear()
      + ('0' + (date.getMonth()+1)).slice(-2);
    this.handleClick(sMonth);
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
    const value = this.state.value;
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

export default Chart;

