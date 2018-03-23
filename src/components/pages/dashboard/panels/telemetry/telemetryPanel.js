// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import 'tsiclient';

import { Indicator } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay
} from 'components/pages/dashboard/panel';
import { joinClasses } from 'utilities';

import './telemetryPanel.css';
// TODO: find a way to import without the relative path
import '../../../../../../node_modules/tsiclient/tsiclient.css';

const chartId = 'telemetry-chart-container';


export class TelemetryPanel extends Component {
  constructor(props) {
    super(props);

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
    this.lineChart = new this.tsiClient.ux.LineChart(document.getElementById(chartId));
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
  }

  componentWillReceiveProps({ telemetry, isPending }) {
    const telemetryKeys = Object.keys(telemetry).sort();
    const currentKey = this.state.telemetryKey;
    this.setState({
      telemetryKeys,
      telemetryKey: currentKey in telemetry ? currentKey : telemetryKeys[0]
    });
  }

  componentWillUpdate(nextProps, { telemetryKey }) {
    const { telemetry } = nextProps;
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
              yAxisState: 'shared' // Default to all values being on the same axis
            },
            this.props.colors.map(color => ({ color }))
          );
        }
      }, 10);
    }
  }

  setTelemetryKey = telemetryKey => () => this.setState({ telemetryKey });

  render() {
    const { t, isPending, telemetry } = this.props;
    const { telemetryKeys, telemetryKey } = this.state;
    const showOverlay = isPending && !Object.keys(telemetry).length;
    return (
      <Panel>
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.telemetry.header')}</PanelHeaderLabel>
          { !showOverlay && isPending && <Indicator size="small" /> }
        </PanelHeader>
        <PanelContent className="telemetry-panel-container">
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
          <div className="chart-container" id={chartId} />
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
      </Panel>
    );
  }
}
