import React, { Component, PropTypes } from 'react';

class Chart extends Component {
  render() {
    const { cData } = this.props;
    return (
      <div>
        React Succeed !
      </div>
    );
  }
 
}

Chart.PropTypes = {
  cData: React.PropTypes.array.isRequired
};

export default Chart;
