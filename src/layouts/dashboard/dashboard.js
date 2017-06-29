// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import SampleWidget from '../../components/sampleWidget/sampleWidget';
import TelemetryWidget from '../../components/telemetryWidget/telemetryWidget';
import AlarmList from '../../components/alarmList/alarmList';
import DeviceMap from '../../components/deviceMap/deviceMap';

import '../layout.css';
import './dashboard.css';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Grid fluid>
          <Row className="widgets row-h3">
            <Col md={5}><DeviceMap/></Col>
            <Col md={7}><TelemetryWidget></TelemetryWidget></Col>
          </Row>
          <Row className="widgets row-h3">
            <Col md={7}><AlarmList/></Col>
            <Col md={5}><SampleWidget/></Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;