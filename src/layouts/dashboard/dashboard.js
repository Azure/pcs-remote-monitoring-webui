// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import TelemetryWidget from '../../components/telemetryWidget/telemetryWidget';
import AlarmList from '../../components/alarmList/alarmList';
import DeviceMap from '../../components/deviceMap/deviceMap';
import KpiWidget from '../../components/kpiWidget/kpiWidget';

import '../layout.css';
import './dashboard.css';

class Dashboard extends Component {
  render() {
    return (
      <Grid fluid className="layout">
        <Row className="widgets row-h60-percent">
          <Col md={5}><DeviceMap/></Col>
          <Col md={7}><TelemetryWidget/></Col>
        </Row>
        <Row className="widgets row-h40-percent">
          <Col md={7}><AlarmList/></Col>
          <Col md={5}><KpiWidget/></Col>
        </Row>
      </Grid>
    );
  }
}

export default Dashboard;