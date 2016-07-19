import React, { Component, PropTypes } from 'react';
import dygraph from 'dygraphs';


class Chart extends Component {
  render() {
    const { cData } = this.props;
    //console.log(document.getElementsByClassName('chart'));
    const g = new dygraph (
          document.getElementById('root'),
          cData,
          {
            title: 'Number of Login users V.S. Time',
            height: 640,
            width: '960',
            labels: ['Time', 'Numbers of Login users'],
            xlabel: 'Time',
            ylabel: 'Number of Login users',
            fillGraph: true
          }
        );
    //return (
      //<div className='chart'>
        //{g}
        //Hello
      //</div>
          //);
  }
}

Chart.PropTypes = {
  cData: React.PropTypes.array.isRequired
};

export default Chart;

