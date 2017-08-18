// Copyright (c) Microsoft. All rights reserved.

import React, { PureComponent } from 'react';
import C3 from 'c3';

class Chart extends PureComponent {
  componentDidMount() {
    this.createChart();
  }

  componentWillUpdate(nextProps) {
    if (this.chartInstance) {
      setTimeout(() => {
        this.chartInstance.load(this.props.chartConfig.data);
      });
    }
  }

  componentWillUnmount() {
    if (this.chartInstance) {
      try {
        this.chartInstance.destroy();
      } catch (e) {
        console.warn('Error destroying the chart', e);
      }
    }
  }

  createChart() {
    this.chartInstance = C3.generate({ ...this.props.chartConfig });
  }

  render() {
    return <div id={this.props.chartId}>PlaceHolder for Chart</div>;
  }
}

export default Chart;
