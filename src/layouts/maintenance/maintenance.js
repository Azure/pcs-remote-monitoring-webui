// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import * as actions from '../../actions';
import MaintenanceWidget from '../../components/maintenance/maintenanceWidget';

import '../layout.css';

class Maintenance extends Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.loadDevicesByTelemetryMessages();
  }

  render() {
    return (
      <Grid fluid className="layout">
        <Row className="widgets rowH100Percent">
          <Col md={12}>
            <MaintenanceWidget alarms={this.props.alarmList} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    alarmList: state.deviceReducer.alarmsList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Maintenance);
