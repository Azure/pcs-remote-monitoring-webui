// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import update from 'immutability-helper';
import { Observable } from 'rxjs';
import 'tsiclient';

import { joinClasses } from 'utilities';
import { toDiagnosticsModel } from 'services/models';

import './telemetryChart.scss';

const maxDatums = 100; // Max telemetry messages for the telemetry graph

// Extend the immutability helper to include object autovivification
update.extend('$auto', (val, obj) => update(obj || {}, val));

export const chartColors = [
  '#01B8AA',
  '#F2C80F',
  '#E81123',
  '#3599B8',
  '#33669A',
  '#26FFDE',
  '#E0E7EE',
  '#FDA954',
  '#FD625E',
  '#FF4EC2',
  '#FFEE91'
];
export const chartColorObjects = chartColors.map(color => ({ color }));

/**
 *  A helper function containing the logic to convert a getTelemetry response
 *  object into the chart object structure.
 *
 * @param getCurrentTelemetry A function that returns an object of formatted telemetry messages
 * @param items An array of telemetry messages from the getTelemetry response object
 */
export const transformTelemetryResponse = getCurrentTelemetry => items =>
  Observable.from(items)
    .flatMap(({ data, deviceId, time }) =>
      Observable.from(Object.keys(data))
        .filter(metric => metric.indexOf('Unit') < 0)
        .map(metric => ({ metric, deviceId, time, data: data[metric] }))
    )
    .reduce(
      (acc, { metric, deviceId, time, data }) =>
        update(acc, {
          [metric]: { $auto: {
            [deviceId]: { $auto: {
              '': { $auto: {
                [time]: { $auto: {
                  val: { $set: data }
                }}
              }}
            }}
          }}
        }),
      getCurrentTelemetry()
    )
    // Remove overflowing items
    .map(telemetry => {
      Object.keys(telemetry).forEach(metric => {
        Object.keys(telemetry[metric]).forEach(deviceId => {
          const datums = Object.keys(telemetry[metric][deviceId]['']);
          if (datums.length > maxDatums) {
            telemetry[metric][deviceId][''] = datums.sort()
              .slice(datums.length - maxDatums, datums.length)
              .reduce((acc, time) => ({ ...acc, [time]: telemetry[metric][deviceId][''][time]}), {});
          }
        })
      });
      return telemetry;
    });

export class TelemetryChart extends Component {

  static telemetryChartCount = 0;

  constructor(props) {
    super(props);

    this.chartId = `telemetry-chart-container-${TelemetryChart.telemetryChartCount++}`;

    this.state = {
      telemetryKeys: [],
      telemetryKey: '',
      renderChart: true
    };

    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);

    this.tsiClient = new window.TsiClient();
  }

  handleWindowBlur = () => this.setState({ renderChart: false });
  handleWindowFocus = () => this.setState({ renderChart: true });

  componentDidMount() {
    this.lineChart = new this.tsiClient.ux.LineChart(document.getElementById(this.chartId));
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
  }

  componentWillReceiveProps({ telemetry }) {
    const telemetryKeys = Object.keys(telemetry).sort();
    const currentKey = this.state.telemetryKey;
    this.setState({
      telemetryKeys,
      telemetryKey: currentKey in telemetry ? currentKey : telemetryKeys[0]
    });
  }

  componentWillUpdate({ telemetry, theme }, { telemetryKey }) {
    if (Object.keys(telemetry).length && telemetryKey && telemetry[telemetryKey]) {
      const chartData = Object.keys(telemetry[telemetryKey]).map(deviceId => ({
        [deviceId]: telemetry[telemetryKey][deviceId]
      }));
      const noAnimate = telemetryKey === this.state.telemetryKey;
      // Set a timeout to allow the panel height to be calculated before updating the graph
      setTimeout(() => {
        if (this && this.state && this.lineChart && this.state.renderChart) {
          this.lineChart.render(
            chartData,
            {
              grid: false,
              legend: 'compact',
              noAnimate, // If the telemetryKey changes, animate
              tooltip: true,
              yAxisState: 'shared', // Default to all values being on the same axis
              theme
            },
            this.props.colors
          );
        }
      }, 10);
    }
  }

  setTelemetryKey = telemetryKey => () => {
    this.props.logEvent(toDiagnosticsModel('TelemetryChartFilter_Click', {}));
    this.setState({ telemetryKey });
  }

  render() {
    const { telemetry } = this.props;
    const { telemetryKeys, telemetryKey } = this.state;
    return (
      <div className="telemetry-chart-container">
        <div className="options-container">
          {
            telemetryKeys.map((key, index) => {
              const count = Object.keys(telemetry[key]).length;
              return (
                <button key={index}
                      onClick={this.setTelemetryKey(key)}
                      className={joinClasses('telemetry-option', telemetryKey === key ? 'active' : '')}>
                  {`${key} [${count}]`}
                </button>
              );
            })
          }
        </div>
        <div className="chart-container" id={this.chartId} />
      </div>
    );
  }
}
