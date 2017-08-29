// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import DeviceList from '../../components/deviceList/deviceList';

import '../layout.css';

export default class Devices extends Component {
  render() {
    return (
      <Grid fluid className="layout">
        <Row className="widgets rowH100Percent">
          <Col md={12}>
            <DeviceList />
          </Col>
        </Row>
      </Grid>
    );
  }
}
