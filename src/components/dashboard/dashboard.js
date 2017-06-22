// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import './dashboard.css';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Row className="widgets">
            <Col xs={7} md={5}><h2>Widget 1</h2></Col>
            <Col xs={7} md={5}><h2>Widget 2</h2></Col>
          </Row>
          <Row className="widgets">
            <Col xs={10} md={7}><h2>Widget 3</h2></Col>
            <Col xs={4} md={3}><h2>Widget 4</h2></Col>
          </Row>
          <Row className="widgets">
            <Col xs={5} md={4}><h2>Widget 5</h2></Col>
            <Col xs={5} md={4}><h2>Widget 6</h2></Col>
            <Col xs={4} md={2}><h2>Widget 7</h2></Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;