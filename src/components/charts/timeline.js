// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import C3 from 'c3';
import './chart.css';

class Timeline extends Component {
  componentDidMount() {
    this.state = {
      timeline: C3.generate({ ...this.props.chartConfig })
    };
  }

  switchChart(newProps) {
    this.state.timeline.load({ ...newProps, unload: true });
  }

  updateChart(props) {
    this.state.timeline.load.flow({ ...props, duration: 1500 });
  }

  componentWillReceiveProps(nextProps) {
    const { columns } = nextProps.chartConfig.data;
    this.switchChart({ columns, unload: true });
  }

  render() {
    return <div id={this.props.chartId} />;
  }
}

export default Timeline;
