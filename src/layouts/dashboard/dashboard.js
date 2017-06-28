// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import SampleWidget from '../../components/sampleWidget/sampleWidget';
import '../layout.css';
import './dashboard.css';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Grid fluid>
          <Row className="widgets row-h3">
            <Col md={6}><SampleWidget title={"Friends"}></SampleWidget></Col>
            <Col md={6}><SampleWidget></SampleWidget></Col>
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