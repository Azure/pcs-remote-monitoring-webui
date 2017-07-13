// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import TelemetryWidget from '../../components/telemetryWidget/telemetryWidget';
import AlarmList from '../../components/alarmList/alarmList';
import DeviceMap from '../../components/deviceMap/deviceMap';
import KpiWidget from '../../components/kpiWidget/kpiWidget';
import SampleWidget from '../../components/sampleWidget/sampleWidget';
import SampleWgtRedux from '../../components/sampleWidgetRedux/sampleWgtRedux';
import Flyout from '../../components/flyout/flyout';
import * as actions from '../../actions';

import '../layout.css';
import './dashboard.css';

class Dashboard extends Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.loadMessages();
    actions.loadDevices();
    actions.loadMapkey();
  }

  render() {
    const { flyout, actions } = this.props;
    const flyoutProp = {
      show: flyout.show,
      onClose: actions.hideFlyout,
      content: flyout.content
    };

    const sampleWgtReduxProps = {
      messages: this.props.messages
    };

    const deviceMapProps = {
      devices: this.props.devices,
      mapkey: this.props.mapkey
    };

    return (
      <Grid fluid className="layout">
        <Row className="widgets rowH60Percent">
          <Col md={5}>
            <DeviceMap {...deviceMapProps} />
          </Col>
          <Col md={7}>
            <TelemetryWidget />
          </Col>
        </Row>
        <Row className="widgets rowH40Percent">
          <Col md={7}>
            <AlarmList />
          </Col>
          <Col md={5}>
            <KpiWidget />
          </Col>
        </Row>
        <Row className="widgets row-h40-percent">
          <Col md={7}>
            <SampleWgtRedux {...sampleWgtReduxProps} />
          </Col>
          <Col md={5}>
            <SampleWidget />
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
    messages: state.messageReducer.messages,
    devices: state.deviceReducer.devices,
    mapkey: state.mapReducer.mapkey
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
