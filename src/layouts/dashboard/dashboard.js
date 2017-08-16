// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import Telemetry from '../../components/telemetryWidget/telemetry';
import AlarmList from '../../components/alarmList/alarmList';
import KpiWidget from '../../components/kpiWidget/kpiWidget';
import Flyout from '../../components/flyout/flyout';
import * as actions from '../../actions';
import DeviceMap from '../../components/deviceMap/deviceMap.js';

import '../layout.css';
import './dashboard.css';

class Dashboard extends Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.loadDevicesByTelemetryMessages();
    actions.loadAlarmList();
    actions.loadMapkey();
    actions.loadDevices();
  }

  render() {
    const { flyout, actions } = this.props;
    const flyoutProp = {
      show: flyout.show,
      onClose: actions.hideFlyout,
      content: flyout.content
    };
    const deviceMapProps = {
      alarmList: this.props.alarmList,
      devices: this.props.devices,
      telemetryByDeviceGroup: this.props.telemetryByDeviceGroup,
      mapkey: this.props.mapkey
    };

    return (
      <Grid fluid className="layout">
        <Row>
          <Col md={8}>
            <DeviceMap {...deviceMapProps} />
          </Col>
          <Col md={4}>
            <AlarmList />
          </Col>
        </Row>
        <Row className="widgets rowH40Percent">
          <Col md={8}>
            <Telemetry chartId="telemetry_chart" />
          </Col>
          <Col md={4}>
            <KpiWidget />
          </Col>
        </Row>
        <Flyout {...flyoutProp} />
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    flyout: state.flyoutReducer,
    telemetryByDeviceGroup: state.telemetryReducer.telemetryByDeviceGroup,
    devices: state.deviceReducer.devices,
    mapkey: state.mapReducer.mapkey,
    alarmList: state.kpiReducer.alarmList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
