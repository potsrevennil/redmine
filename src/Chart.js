import React, { Component, PropTypes } from 'react';
import { AreaChart } from 'react-d3-components';


class Chart extends Component {
  render() {
    const { cData } = this.props;
    const x = (d) => {
      return d.time;
    };
    const y = (d) => {
      return d.amount;
    };
    var data = [{
      label: '',
      values: cData
    }];
    //console.log(d3.range(cData[0].time, cData[cData.length - 1].time).ticks(d3.time.hour, 1));
    console.log(d3.time.scale().domain([cData[0].time, cData[cData.length - 1].time]).ticks(d3.time.hour, 1));
    console.log(cData[0].time);
    console.log(cData[cData.length - 1].time);
    return (
      <div>
        <AreaChart
          height={400}
          width={400}
          data={data}
          x={x}
          y={y}
          xAxis={{tickValues: d3.time.scale().domain([cData[0].time, cData[cData.length - 1].time]).ticks(d3.time.hour, 1), tickFormat: d3.time.format("%H:%M"), label: 'Time'}}
          yAxis={{label: 'Logined Users'}}
        />
      </div>
    );
  }
}

Chart.PropTypes = {
  cData: React.PropTypes.array.isRequired
};

export default Chart;

