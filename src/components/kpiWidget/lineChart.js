// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from './generateChart';
import { Col } from 'react-bootstrap';
import DeltaDown from '../../assets/icons/DeltaDown.svg';
import DeltaUp from '../../assets/icons/DeltaUp.svg';
import Lang from '../../common/lang';
import { getNonFunctionalProps } from '../../common/utils';
import './kpiWidget.css';
import _ from 'lodash';

class LineChart extends Component {
  componentWillMount() { this.updateLineChartData(this.props); }

  shouldComponentUpdate(nextProps, nextState) {
    let nonFunctionalNextProps = _.omit(getNonFunctionalProps(nextProps), ['chartDataFetchComplete']);
    let nonFunctionalThisProps = _.omit(getNonFunctionalProps(this.props), ['chartDataFetchComplete']);
    let result = !_.isEqual(nonFunctionalNextProps, nonFunctionalThisProps);
    return result;
  }

  componentWillUpdate(nextProps) { this.updateLineChartData(nextProps); }

  updateLineChartData(nextProps) {
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
          {Lang.CRITICALALARM}
        </div>
        <div className="percentage-critical">
          {typeof this.props.criticalAlarmCountLast !== 'undefined' &&
          typeof this.props.criticalAlarmCount !== 'undefined' &&
          this.props.criticalAlarmCountLast !== this.props.criticalAlarmCount
            ? <div className="percentage"><img
                className="delta-down"
                src={
                  this.props.criticalAlarmCountLast >
                  this.props.criticalAlarmCount
                    ? DeltaDown
                    : DeltaUp
                }
                alt={
                  this.props.criticalAlarmCountLast >
                  this.props.criticalAlarmCount
                    ? `${DeltaDown}`
                    : `${DeltaUp}`
                }
              />
              {this.props.percentChange}% </div>
            : null}
        </div>
        {lineChart && this.props.lineChartData && lineChart.chartConfig
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
  return alarms.reduce(
    (count, { Rule }) => Rule.Severity === 'critical' ? ++count : count,
    0 // Default count
  );
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
  const lineChartData = [
    [
      'criticalAlarmCount',
      criticalAlarmCountLast,
      criticalAlarmCount
    ]
  ];

  const percentChange = ((criticalAlarmCount - criticalAlarmCountLast) / criticalAlarmCount * 100).toFixed(2);
  if (isNaN(percentChange)) return;

  return {
    lineChartData: lineChartData,
    percentChange,
    criticalAlarmCountLast,
    criticalAlarmCount
  };
};

export default connect(mapStateToProps, null)(LineChart);
