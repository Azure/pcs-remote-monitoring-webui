// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import 'tsiclient';

import { Indicator } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay,
  PanelError
} from 'components/pages/dashboard/panel';

import './kpisPanel.css';

const barChartId = 'kpi-bar-chart-container';
const pieChartId = 'kpi-pie-chart-container';

export class KpisPanel extends Component {

  constructor(props) {
    super(props);

    this.state = { renderChart: true };

    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);

    this.tsiClient = new window.TsiClient();
  }

  handleWindowBlur = () => this.setState({ renderChart: false });
  handleWindowFocus = () => this.setState({ renderChart: true });

  componentDidMount() {
    this.barChart = new this.tsiClient.ux.BarChart(document.getElementById(barChartId));
    this.pieChart = new this.tsiClient.ux.PieChart(document.getElementById(pieChartId));
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
  }

  componentWillUpdate(nextProps, nextState) {
    const staticTime = '';

    // ================== Bar chart - START
    if (nextProps.topAlarms.length) {
      // Convert the raw counts into a chart readable format
      const currentWindow = nextProps.t('dashboard.panels.kpis.currentWindow');
      const previousWindow = nextProps.t('dashboard.panels.kpis.previousWindow');
      const barChartDatum = nextProps.topAlarms.map(({ name, count, previousCount }) => ({
        [name]: {
          [currentWindow]: { [staticTime]: { val: count } }, // TODO: Translate legends
          [previousWindow]: { [staticTime]: { val: previousCount } },
        }
      }));

      if (nextState.renderChart) {
        this.barChart.render(
          barChartDatum,
          { grid: false, legend: 'hidden', tooltip: true, yAxisState: 'shared' },
          this.props.colors.map(color => ({ color }))
        );
      }
    }
    // ================== Bar chart - END

    // ================== Pie chart - START
    const deviceTypes = Object.keys(nextProps.alarmsPerDeviceId);
    if (deviceTypes.length) {
      // Convert the raw counts into a chart readable format
      // Sort the deviceTypes so the chart sections and color won't change on update
      const pieChartDatum = deviceTypes.sort().map(deviceType => ({
        [deviceType]: {
          '': { [staticTime]: { val: nextProps.alarmsPerDeviceId[deviceType] } }
        }
      }));

      if (nextState.renderChart) {
        this.pieChart.render(
          pieChartDatum,
          { grid: false, timestamp: staticTime, legend: 'hidden', arcWidthRatio: 1 },
          this.props.colors.map(color => ({ color }))
        );
      }
    }
    // ================== Pie chart - END
  }

  render() {
    const { t, isPending, criticalAlarmsChange, error } = this.props;
    const showOverlay = isPending && !criticalAlarmsChange;
    return (
      <Panel>
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.kpis.header')}</PanelHeaderLabel>
          { !showOverlay && isPending && <Indicator size="small" /> }
        </PanelHeader>
        <PanelContent className="kpis-panel-container">
          <div className="kpi-cell full-width">
            <div className="kpi-header">{t('dashboard.panels.kpis.topRule')}</div>
            <div className="chart-container" id={barChartId} />
          </div>
          <div className="kpi-cell">
            <div className="kpi-header">{t('dashboard.panels.kpis.deviceTypeAlarms')}</div>
            <div className="chart-container" id={pieChartId} />
          </div>
          <div className="kpi-cell">
            <div className="kpi-header">{t('dashboard.panels.kpis.criticalAlarms')}</div>
            <div className="critical-alarms">
              {
                criticalAlarmsChange !== 0 &&
                  <div className="kpi-percentage-container">
                    <div className="kpi-value">{ criticalAlarmsChange }</div>
                    <div className="kpi-percentage-sign">%</div>
                  </div>
              }
            </div>
          </div>
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
        { error && <PanelError>{t(error.message)}</PanelError> }
      </Panel>
    );
  }
}
