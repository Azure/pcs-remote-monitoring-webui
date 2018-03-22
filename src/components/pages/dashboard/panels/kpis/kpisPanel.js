// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Observable } from 'rxjs';
import 'tsiclient';

import { TelemetryService } from 'services';
import { Indicator } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelContent,
  PanelOverlay
} from 'components/pages/dashboard/panel';

import './kpisPanel.css';

const chartColors = [
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
const maxTopAlarms = 5; // TODO: Move to config

const barChartId = 'kpi-bar-chart-container';
const pieChartId = 'kpi-pie-chart-container';

const compareByProperty = (property) => (a, b) => {
  if (b[property] > a[property]) return 1;
  if (b[property] < a[property]) return -1;
  return 0;
};

const countCriticalAlarms = alarms => alarms.reduce(
  (count, { severity }) => severity === 'critical' ? count + 1 : count,
  0
);

const Percentage = ({ value }) => (
  <div className="kpi-percentage-container">
    <div className="kpi-value">{ value }</div>
    <div className="kpi-percentage-sign">%</div>
  </div>
);

export class KpisPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPending: true,
      currentActiveAlarms: [],
      previousActiveAlarms: [],
      currentAlarms: [],
      previousAlarms: [],
      criticalAlarmsChange: 0
    };

    // Initialize chart client
    this.tsiClient = new window.TsiClient();
  }

  componentDidMount() {
    // Create line chart
    this.barChart = new this.tsiClient.ux.BarChart(document.getElementById(barChartId));
    this.pieChart = new this.tsiClient.ux.PieChart(document.getElementById(pieChartId));

    const currentFrom = 'NOW-PT1H';
    const previousFrom = 'NOW-PT2H';

    const currentParams = { from: currentFrom, to: 'NOW' };
    const previousParams = { from: previousFrom, to: currentFrom };

    // TODO: Add device ids to params - START
    this.subscription = Observable.forkJoin(
      TelemetryService.getActiveAlarms(currentParams), // Get current
      TelemetryService.getActiveAlarms(previousParams), // Get previous

      TelemetryService.getAlarms(currentParams),
      TelemetryService.getAlarms(previousParams)
    ).subscribe(([
      currentActiveAlarms,
      previousActiveAlarms,

      currentAlarms,
      previousAlarms
    ]) => {
      // ================== Critical Alarms - START
      const currentCriticalAlarms = countCriticalAlarms(currentAlarms);
      const previousCriticalAlarms = countCriticalAlarms(previousAlarms);
      const criticalAlarmsChange = ((currentCriticalAlarms - previousCriticalAlarms) / currentCriticalAlarms * 100).toFixed(2);
      // ================== Critical Alarms - END
      this.setState({
        currentActiveAlarms,
        previousActiveAlarms,
        currentAlarms,
        previousAlarms,
        criticalAlarmsChange,
        isPending: false
      });
    });
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  componentWillUpdate(nextProps, nextState) {
    const time = '2017-04-19T13:00:00Z'; // TODO: Remove hard coded time, needed by the charts

    // ================== Bar chart - START
    if (nextState.currentActiveAlarms.length) {
      // Compute top 5 kpis
      const topAlarms = nextState.currentActiveAlarms
        .sort(compareByProperty('count'))
        .slice(0, maxTopAlarms);

      // Find the previous counts for the current top 5 kpis
      const previousTopAlarms = nextState.previousActiveAlarms.reduce(
        (acc, { ruleId, count }) =>
          (ruleId in acc)
            ? { ...acc, [ruleId]: count }
            : acc
        ,
        topAlarms.reduce((acc, { ruleId }) => ({ ...acc, [ruleId]: 0 }), {})
      );

      // Convert the raw counts into a chart readable format
      const barChartDatum = topAlarms.map(({ ruleId, count }) => ({
        [(this.props.rules[ruleId] || {}).name || ruleId]: {
          'Current Month': { [time]: { val: count } }, // TODO: Translate legends
          'Previous Month': { [time]: { val: previousTopAlarms[ruleId] } },
        }
      }));

      // Render the chart
      this.barChart.render(
        barChartDatum,
        {
          grid: false,
          legend: 'hidden',
          tooltip: true,
          yAxisState: 'shared' // Default to all values being on the same axis
        },
        chartColors.map(color => ({ color }))
      );
    }
    // ================== Bar chart - END

    // ================== Pie chart - START
    if (nextState.currentAlarms.length) {
      // Count alarms per device type
      const alarmsPerDeviceId = nextState.currentAlarms.reduce((acc, { deviceId }) => {
        if (deviceId) {
          const deviceType = this.props.devices[deviceId].type || 'Other'; // TODO: Translate
          return { ...acc, [deviceType]: (acc[deviceType] || 0) + 1 };
        }
        return acc;
      }, {});

      // Convert the raw counts into a chart readable format
      const pieChartDatum = Object.keys(alarmsPerDeviceId).map(deviceType => ({
        [deviceType]: {
          [deviceType]: { [time]: { val: alarmsPerDeviceId[deviceType] } }
        }
      }));

      // Render the chart
      this.pieChart.render(
        pieChartDatum,
        {
          grid: false,
          timestamp: time,
          legend: 'hidden',
          arcWidthRatio: .6
        },
        chartColors.map(color => ({ color }))
      );
    }
    // ================== Pie chart - END
  }

  render() {
    const isPending = this.state.isPending;
    return (
      <Panel>
        <PanelHeader>System KPIs</PanelHeader>
        <PanelContent className="kpis-panel-container">
          <div className="kpi-cell full-width">
            <div className="kpi-header">Top rules triggered</div>
            <div className="chart-container" id={barChartId} />
          </div>
          <div className="kpi-cell">
            <div className="kpi-header">Alarm by device type</div>
            <div className="chart-container" id={pieChartId} />
          </div>
          <div className="kpi-cell">
            <div className="kpi-header">Critical alarms</div>
            <div className="critical-alarms">
              <Percentage value={this.state.criticalAlarmsChange} />
            </div>
          </div>
        </PanelContent>
        { isPending && <PanelOverlay><Indicator /></PanelOverlay> }
      </Panel>
    );
  }
}
