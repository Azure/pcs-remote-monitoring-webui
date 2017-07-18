// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import TelemetryWidget from '../../components/telemetryWidget/telemetryWidget';
import AlarmList from '../../components/alarmList/alarmList';
import KpiWidget from '../../components/kpiWidget/kpiWidget';
import RegionDetails from '../../components/deviceMap/regionDetails.js';
import Flyout from '../../components/flyout/flyout';
import * as actions from '../../actions';
import DeviceMap from '../../components/deviceMap/deviceMap.js';
import lang from '../../common/lang';

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
    const deviceMapProps = {
      devices: this.props.devices,
      mapkey: this.props.mapkey
    };

    return (
      <Grid fluid className="layout">
        <Row className="">
          <Col md={8}>
            <div className="region-header row">
              <span className="device-location">{lang.DASHBOARD.DEVICELOCATION}</span>
              <span className="more">{lang.DASHBOARD.MORE}</span>
            </div>
            <Row className="device-map">
              <RegionDetails />
              <Col md={9} className="map-container">
                <DeviceMap {...deviceMapProps} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
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
