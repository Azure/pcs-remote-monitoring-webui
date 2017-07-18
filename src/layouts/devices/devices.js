// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import AddDevice from '../../components/addDevice/addDevice';
import '../layout.css';

class Devices extends Component {
  render() {
    return (
      <Grid fluid className="layout">
        <Row className="widgets">
          <Col md={6}></Col>
          <Col md={6}><AddDevice/></Col>
        </Row>
      </Grid>
    );
  }
}

export default Devices;