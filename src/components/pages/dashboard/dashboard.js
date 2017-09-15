// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import PageContainer from '../../layout/pageContainer/pageContainer.js';
import PageContent from '../../layout/pageContent/pageContent.js';
import TopNav from '../../layout/topNav/topNav.js';
import ContextFilters from '../../layout/contextFilters/contextFilters.js';
import Telemetry from '../../telemetryWidget/telemetry';
import AlarmList from '../../alarmList/alarmList';
import KpiWidget from '../../kpiWidget/kpiWidget';
import * as actions from '../../../actions';
import DeviceMap from '../../deviceMap/deviceMap.js';
import lang from '../../../common/lang';
import ManageFilterBtn from '../../shared/contextBtns/manageFiltersBtn';

class DashboardPage extends Component {

  componentDidMount() {
    const { actions } = this.props;
    actions.loadDevicesByTelemetryMessages();
    actions.loadDevices();
  }

  render() {
    const deviceMapProps = {
      alarmList: this.props.alarmList,
      devices: this.props.devices,
      telemetryByDeviceGroup: this.props.telemetryByDeviceGroup,
      mapkey: this.props.mapkey
    };

    const devicesList = this.props.devices && this.props.devices.items ? this.props.devices.items : [];
    const alarmListProps = {
      devices: devicesList.map(device => device.Id)
    };

    return (
      <PageContainer>
        <TopNav breadcrumbs={'Dashboard'} projectName={lang.DASHBOARD.AZUREPROJECTNAME} />
        <ContextFilters>
          <ManageFilterBtn />
        </ContextFilters>
        <PageContent>
          <Grid fluid className="layout">
            <Row>
              <Col md={8}>
                <DeviceMap {...deviceMapProps} />
              </Col>
              <Col md={4}>
                <AlarmList {...alarmListProps} />
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Telemetry chartId="telemetry_chart" />
              </Col>
              <Col md={4}>
                <KpiWidget />
              </Col>
            </Row>
          </Grid>
        </PageContent>
      </PageContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    telemetryByDeviceGroup: state.telemetryReducer.telemetryByDeviceGroup,
    devices: state.deviceReducer.devices,
    mapkey: state.mapReducer.mapkey,
    alarmList: state.deviceReducer.alarmsList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
