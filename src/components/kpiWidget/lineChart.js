// Copyright (c) Microsoft. All rights reserved.

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Chart from './generateChart';
import { Col } from 'react-bootstrap';
import Lang from '../../common/lang';
import './kpiWidget.css';

class LineChart extends PureComponent {
  componentWillUpdate(nextProps) {
    this.lineChart = {
      chartConfig: {
        size: {
          height: 150,
          width: 150
        },
        bindto: '#lineChart',
        data: {
          columns: nextProps.lineChartData,
          type: 'line',
          unload: true
        },
        legend: {
          show: false
        },
        axis: {
          x: {
            show: false
          },
          y: {
            show: false
          }
        }
      },
      chartId: 'lineChart'
    };
  }

  render() {
    const lineChart = this.lineChart;
    return (
      <Col md={6} className="line-chart">
        <div className="line-header">
          {Lang.KPI.CRITICALALARM}
        </div>
        <div className="percentage-critical">
          {this.props.percentChange}%
        </div>
        {this.props.lineChartData && this.props.lineChartData.length
          ? <Chart
              chartConfig={lineChart.chartConfig}
              chartId={lineChart.chartId}
            />
          : null}
      </Col>
    );
  }
}

const getCriticalCount = alarms => {
  let criticalAlarmCount = 0;

  alarms.forEach(item => {
    if (item.Rule.Severity === 'critical') {
      criticalAlarmCount++;
    }
  });
  return criticalAlarmCount;
};

const mapStateToProps = state => {
  if (
    !state.deviceReducer ||
    !state.deviceReducer.devices ||
    !state.kpiReducer ||
    !state.kpiReducer.alarmsList ||
    !state.kpiReducer.alarmListLastDuration
  ) {
    return {};
  }

  const alarms = state.kpiReducer.alarmsList;
  const alarmListLastDuration = state.kpiReducer.alarmListLastDuration;
  //this is current day/week/month Critical alarm count
  const criticalAlarmCount = getCriticalCount(alarms);
  //this is last day/week/month alarm count
  const criticalAlarmCountLast = getCriticalCount(alarmListLastDuration);
  const lineChartData = [];
  lineChartData.push([
    'criticalAlarmCount',
    criticalAlarmCountLast,
    criticalAlarmCount
  ]);

  const percentChange = ((criticalAlarmCount - criticalAlarmCountLast) /
    criticalAlarmCount *
    100).toFixed(2);

  return {
    lineChartData: lineChartData,
    percentChange
  };
};

export default connect(mapStateToProps, null)(LineChart);
