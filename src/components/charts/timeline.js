// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import C3 from 'c3';
import moment from 'moment';
import _ from 'lodash';
import Config from '../../common/config';

import './chart.css';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeline: {}
    };
  }

  componentDidMount() {
    this.setState({ timeline: C3.generate({ ...this.props.chartConfig }) });
  }

  destroyChart() {
    this.state.timeline.unload();
  }

  switchChart(props) {
    this.state.timeline.load({ ...props, unload: true });
  }

  updateChart(props) {
    const startTime = moment()
      .subtract(Config.INTERVALS.TELEMETRY_SLIDE_WINDOW_MIN, 'minutes')
      .toISOString();
    this.state.timeline.flow({
      ...props,
      duration: Config.INTERVALS.TELEMETRY_FLOW_DURATION_MS,
      to: startTime
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.destroy) {
      this.destroyChart();
      return;
    }
    const propsIsEqual = _.isEqual(
      nextProps,
      this.props
    );
    const { data } = nextProps.chartConfig;
    if (
      propsIsEqual ||
      !data ||
      !data.json ||
      !data.json.length ||
      !nextProps.selectedTelemetry
    ) {
      return;
    }

    if (
      this.props.selectedTelemetry === nextProps.selectedTelemetry &&
      this.props.chartId === nextProps.chartId
    ) {
      this.updateChart(data);
    }
    if (
      this.props.selectedTelemetry !== nextProps.selectedTelemetry ||
      this.props.chartId !== nextProps.chartId
    ) {
      this.switchChart(data);
    }
  }

  render() {
    return <div id={this.props.chartId} />;
  }
}

export default Timeline;
