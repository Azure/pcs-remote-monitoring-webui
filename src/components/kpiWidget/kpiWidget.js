// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Rx from 'rxjs';
import { connect } from 'react-redux';
import { refreshAllChartData } from '../../actions/kpiActions';
import PieChartGraph from './pieChartGraph';
import BarChart from './barChart';
import { Grid, Row, Col } from 'react-bootstrap';
import Config from '../../common/config';
import Lang from '../../common/lang';
import DashboardPanel from '../dashboardPanel/dashboardPanel';

import './kpiWidget.css';

class KpiWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeRange: this.props.timeRange || 'PT1H'
    };

    this.subscriptions = [];
    this.errorSubject = new Rx.Subject();
  }

  componentDidMount() {
    this.subscriptions.push(
      Rx.Observable.interval(Config.INTERVALS.TELEMETRY_UPDATE_MS)
        .startWith(-1)
        .takeUntil(this.errorSubject)
        .subscribe(() => this.props.intervalChanged(this.state.timeRange, true))
    );
  }

  componentWillReceiveProps(nextProps) {
    const { timeRange } = nextProps;
    if (timeRange && timeRange !== this.props.timeRange) {
      this.setState(
        { timeRange },
        () => this.props.intervalChanged(timeRange)
      )
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  render() {
    return (
      <DashboardPanel
        className="kpi-widget"
        showNoDataOverlay={!this.props.alarmList.length && !(this.props.alarmsByRule && this.props.alarmsByRule.length)}
        showHeaderSpinner={this.props.showHeaderSpinner}
        showContentSpinner={this.props.showContentSpinner}
        title={Lang.SYSTEMKPI}
      >
        <Grid fluid className="kpi-widget">
          <div className="kpi-container">
            <Row>
              <Col md={12} className="top-rules">
                {Lang.TOPRULESTRIGGERED}
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <BarChart timeCode={this.state.selectedValue} />
              </Col>
            </Row>
            <Row className="kpi-row">
              <Col md={12}>
                <PieChartGraph />
              </Col>
            </Row>
          </div>
        </Grid>
      </DashboardPanel>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  intervalChanged: (timeCode, refreshFlag) => {
    let firstDurationFrom, secondDurationFrom, secondDurationTo;
    switch (timeCode) {
      case 'PT1H':
        secondDurationTo = firstDurationFrom = 'NOW-PT1H';
        secondDurationFrom = 'NOW-PT2H';
        break;

      case 'P1D':
        secondDurationTo = firstDurationFrom = 'NOW-P1D';
        secondDurationFrom = 'NOW-P2D';
        break;

      case 'P7D':
        secondDurationTo = firstDurationFrom = 'NOW-P7D';
        secondDurationFrom = 'NOW-P14D';
        break;

      case 'P1M':
        secondDurationTo = firstDurationFrom = 'NOW-P1M';
        secondDurationFrom = 'NOW-P2M';
        break;

      default:
        return null;
    }

    dispatch(refreshAllChartData(firstDurationFrom, 'NOW', secondDurationFrom, secondDurationTo, refreshFlag));
  }
});

const mapStateToProps = state => ({
  showHeaderSpinner: state.indicatorReducer.kpi,
  showContentSpinner: state.indicatorReducer.kpiInitial,
});

export default connect(mapStateToProps, mapDispatchToProps)(KpiWidget);
