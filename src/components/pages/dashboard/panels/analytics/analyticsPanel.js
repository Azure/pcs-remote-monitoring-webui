// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import 'tsiclient';

import { AjaxError, Indicator, TimeSeriesInsightsLinkContainer } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay,
  PanelError,
  PanelMsg
} from 'components/pages/dashboard/panel';

import './analyticsPanel.scss';

const barChartId = 'analytics-bar-chart-container';
const pieChartId = 'analytics-pie-chart-container';

export class AnalyticsPanel extends Component {

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
    if (nextProps.topAlerts.length) {
      // Convert the raw counts into a chart readable format
      const currentWindow = nextProps.t('dashboard.panels.analytics.currentWindow');
      const previousWindow = nextProps.t('dashboard.panels.analytics.previousWindow');
      const barChartDatum = nextProps.topAlerts.map(({ name, count, previousCount }) => ({
        [name]: {
          [currentWindow]: { [staticTime]: { val: count } }, // TODO: Translate legends
          [previousWindow]: { [staticTime]: { val: previousCount } },
        }
      }));

      if (nextState.renderChart) {
        this.barChart.render(
          barChartDatum,
          { grid: false, legend: 'hidden', yAxisState: 'shared', tooltip: true, theme: nextProps.theme },
          this.props.colors
        );
      }
    }
    // ================== Bar chart - END

    // ================== Pie chart - START
    const deviceTypes = Object.keys(nextProps.alertsPerDeviceId);
    if (deviceTypes.length) {
      // Convert the raw counts into a chart readable format
      // Sort the deviceTypes so the chart sections and color won't change on update
      const pieChartDatum = deviceTypes.sort().map(deviceType => ({
        [deviceType]: {
          '': { [staticTime]: { val: nextProps.alertsPerDeviceId[deviceType] } }
        }
      }));

      if (nextState.renderChart) {
        this.pieChart.render(
          pieChartDatum,
          { grid: false, timestamp: staticTime, legend: 'hidden', tooltip: true, arcWidthRatio: 1, theme: nextProps.theme },
          this.props.colors
        );
      }
    }
    // ================== Pie chart - END
  }

  render() {
    const { t, isPending, criticalAlertsChange, alertsPerDeviceId, topAlerts, timeSeriesExplorerUrl, error } = this.props;
    const showOverlay = isPending && !criticalAlertsChange;
    return (
      <Panel>
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.analytics.header')}</PanelHeaderLabel>
        </PanelHeader>
        <PanelContent className="analytics-panel-container">
          <div className="analytics-cell full-width read-more">
            <div className="analytics-header">{t('dashboard.panels.analytics.topRule')}</div>
            <div className="chart-container" id={barChartId} />
          </div>
          <div className="analytics-cell">
            <div className="analytics-header">{t('dashboard.panels.analytics.deviceTypeAlerts')}</div>
            <div className="chart-container" id={pieChartId} />
          </div>
          <div className="analytics-cell">
            <div className="analytics-header">{t('dashboard.panels.analytics.criticalAlerts')}</div>
            <div className="critical-alerts">
              {
                !showOverlay &&
                <div className="analytics-percentage-container">
                  <div className="analytics-value">{!isNaN(criticalAlertsChange) ? criticalAlertsChange : 0}</div>
                  <div className="analytics-percentage-sign">%</div>
                </div>
              }
            </div>
          </div>
          {
            (!showOverlay && !topAlerts.length && !Object.keys(alertsPerDeviceId).length)
            && <PanelMsg>{t('dashboard.noData')}</PanelMsg>
          }
          {
            timeSeriesExplorerUrl &&
            <TimeSeriesInsightsLinkContainer href={timeSeriesExplorerUrl} />
          }
        </PanelContent>
        {showOverlay && <PanelOverlay><Indicator /></PanelOverlay>}
        {error && <PanelError><AjaxError t={t} error={error} /></PanelError>}
      </Panel>
    );
  }
}
