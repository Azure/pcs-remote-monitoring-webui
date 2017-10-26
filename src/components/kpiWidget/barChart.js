// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from './generateChart';
import { Row, Col } from 'react-bootstrap';
import './kpiWidget.css';
import lang from '../../common/lang';
import { getNonFunctionalProps } from '../../common/utils';
import _ from 'lodash';

import './kpiWidget.css';

class BarChart extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    let nonFunctionalNextProps = _.omit(getNonFunctionalProps(nextProps), ['chartDataFetchComplete']);
    let nonFunctionalThisProps = _.omit(getNonFunctionalProps(this.props), ['chartDataFetchComplete']);
    let result = !_.isEqual(nonFunctionalNextProps, nonFunctionalThisProps);
    return result;
  }

  componentWillMount() { this.updateBarChartData(this.props); }

  componentWillUpdate(nextProps) { this.updateBarChartData(nextProps); }

  updateBarChartData(nextProps) {
    this.barChart = {
      chartConfig: {
        size: {
          height: 100,
          width: 400
        },
        bindto: '#barChart',
        data: {
          x: 'x',
          columns: nextProps.chartData,
          unload: true,
          type: 'bar'
        },
        legend: {
          show: false
        },
        color: {
          pattern: ['#7085FD', '#B3B3B3']
        },
        bar: {
          width: {
            ratio: 0.4
          }
        },
        axis: {
          x: {
            width: 500,
            type: 'category',
            height: 20,
            tick: {
              outer: true
            }
          },
          y: {
            show: false
          }
        }
      },
      chartId: 'barChart'
    };
  }
  render() {
    const barChart = this.barChart || {};
    return (
      <div>
        <Row>
          <Col md={12} className="bar-chart">
            {barChart && barChart.chartConfig
              ? <Chart chartConfig={barChart.chartConfig} chartId={barChart.chartId} />
              : null}
          </Col>
        </Row>
      </div>
    );
  }
}

const sortByCount = (alpha, beta) => {
  if (beta.Count > alpha.Count) {
    return 1;
  } else if (beta.Count < alpha.Count) {
    return -1;
  }
  return 0;
};

const getBarChartData = (state, ownProps) => {
  if (!state.deviceReducer || !state.deviceReducer.devices || !state.kpiReducer || !state.kpiReducer.alarmsByRule) {
    return [];
  }
  const alarmsByRule = state.kpiReducer.alarmsByRule || [];
  const alarmsByRuleLastDuration = state.kpiReducer.alarmsByRuleLastDuration || [];
  const rulesAndActions = state.ruleReducer.rulesAndActions;
  const top5Latest = alarmsByRule.sort(sortByCount).slice(0, 5);
  const chartData = [];
  top5Latest.forEach(data => {
    let lastDurationData;
    alarmsByRule.some(data => {
      rulesAndActions.forEach(Rule => {
        if (data.Rule.Id === Rule.Id) {
          data.Rule.Name = Rule.Name;
        }
        return false;
      });
      return false;
    });
    alarmsByRuleLastDuration.some(data2 => {
      if (data2.Rule.Id === data.Rule.Id) {
        lastDurationData = data2;
        return true;
      }
      return false;
    });
    const computedItem = {
      Id: data.Rule.Id,
      LastDurationCount: 0,
      Count: data.Count,
      Description: data.Rule.Name
    };
    chartData.push(computedItem);
    if (lastDurationData) {
      computedItem.LastDurationCount = lastDurationData.Count;
    }
  });
  let currentDesc, lastDesc;
  if (ownProps.timeCode === 'D') {
    currentDesc = lang.CURRENTDAY;
    lastDesc = lang.LASTDAY;
  } else if (ownProps.timeCode === 'W') {
    currentDesc = lang.CURRENTWEEK;
    lastDesc = lang.LASTWEEK;
  } else {
    currentDesc = lang.CURRENTMONTH;
    lastDesc = lang.LASTMONTH;
  }
  const realChartData = [['x'].concat(chartData.map(rule => rule.Description))];
  realChartData.push([currentDesc].concat(chartData.map(rule => rule.Count)));
  realChartData.push([lastDesc].concat(chartData.map(rule => rule.LastDurationCount)));
  return realChartData;
};

const mapStateToProps = (state, ownProps) => {
  const data = getBarChartData(state, ownProps);
  return {
    chartData: data
  };
};

export default connect(mapStateToProps, null)(BarChart);
