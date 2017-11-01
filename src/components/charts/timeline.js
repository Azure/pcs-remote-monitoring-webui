// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import C3 from 'c3';
import moment from 'moment';
import _ from 'lodash';
import Rx from 'rxjs';
import Config from '../../common/config';

import './chart.css';

const SLIDING_WINDOW_SIZE = 300;

class Timeline extends Component {

  constructor(props) {
    super(props);
    this.chart = {};
    // The chartDataQueue
    this.chartDataQueue = [];
  }

  componentDidMount() {
    // Temp Fix: Pending issues https://github.com/c3js/c3/issues/2057 & https://github.com/c3js/c3/issues/1097
    // Every five minutes, rebuild the chart to avoid a memory leak in the chart library
    // TODO: Remove these hacks when the D3 chart is fixed
    this.subscription = Rx.Observable.interval(1000*60*5)
      .startWith(0)
      .subscribe(_ => {
        if (this.chart.unload) {
          const generateProps = {
            ...this.props.chartConfig,
            data: {
              ...this.props.chartConfig.data,
              json: this.chartDataQueue
            }
          };
          this.chart.unload({
            done: () => this.createChart(generateProps)
          });
        } else {
          this.createChart(this.props.chartConfig);
        }
      });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
    this.chart.destroy();
  }

  createChart(generateProps) {
    this.chart = C3.generate(generateProps);
  }

  destroyChart() {
    this.chart.unload();
  }

  switchChart(props) {
    this.chart.load({ ...props, unload: true });
    this.chartDataQueue = props.json;
  }

  updateChart(props) {
    const startTime = moment()
      .subtract(Config.INTERVALS.TELEMETRY_SLIDE_WINDOW_MIN, 'minutes')
      .toISOString();
    this.chart.flow({
      ...props,
      duration: Config.INTERVALS.TELEMETRY_FLOW_DURATION_MS,
      to: startTime
    });
    // Update the chart data queue with new data and prune it if it gets too large
    this.chartDataQueue = [ ...this.chartDataQueue, ...props.json ];
    while(this.chartDataQueue.length > SLIDING_WINDOW_SIZE) {
      this.chartDataQueue.shift();
    }
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
