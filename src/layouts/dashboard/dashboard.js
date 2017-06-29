// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Config from "../../common/config";
import SampleWidget from '../../components/sampleWidget/sampleWidget';
import TelemetryWidget from '../../components/telemetryWidget/telemetryWidget';
import '../layout.css';
import './dashboard.css';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Grid fluid>
          <Row className="widgets row-h3">
            <Col md={5}><SampleWidget title={"Friends"}></SampleWidget></Col>
            <Col md={7}>
              <TelemetryWidget
                deviceGroupApiUrl={Config.deviceGroupApiUrl}
                telemetryTypeApiUrl={Config.telemetryTypeApiUrl}>
              </TelemetryWidget>
            </Col>
          </Row>
          <Row className="widgets row-h3">
            <Col md={7}><SampleWidget></SampleWidget></Col>
            <Col md={5}><SampleWidget></SampleWidget></Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;