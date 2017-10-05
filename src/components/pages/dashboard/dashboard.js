// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import * as _ from 'lodash';
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
import Config from '../../../common/config';
import ManageFilterBtn from '../../shared/contextBtns/manageFiltersBtn';

class DashboardPage extends Component {

  componentDidMount() {
    const deviceIds = ((this.props.devices || {}).items || []).map(({Id}) => Id) || [];
    this.props.actions.loadDashboardData(deviceIds);
    this.props.actions.loadMapkey();
    this.timerID = setInterval(() => {
      const deviceIds = ((this.props.devices || {}).items || []).map(({Id}) => Id) || [];
      if (deviceIds.length && !this.props.mapControlDataLoading) {
        this.props.actions.loadDashboardDataUpdate(deviceIds);
      }
    }, Config.INTERVALS.TELEMETRY_UPDATE_MS);
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState );
  }

  render() {
    const deviceMapProps = {
      showSpinner: this.props.mapControlDataLoading,
      alarmList: this.props.alarmList,
      devices: this.props.devices,
      telemetryByDeviceGroup: this.props.telemetryByDeviceGroup,
      BingMapKey: this.props.BingMapKey
    };

    const devicesList = this.props.devices && this.props.devices.items ? this.props.devices.items : [];
    const devices = devicesList.map(({ Id }) => Id)
    const alarmListProps = { devices };
    const telemetryProps = {
      chartId: 'dashboard_telemetry_chart',
      devices: this.props.devices,
    }

    return (
      <PageContainer>
        <TopNav breadcrumbs={'Dashboard'} projectName={lang.AZUREPROJECTNAME} />
        <ContextFilters>
          <ManageFilterBtn />
        </ContextFilters>
        <PageContent>
          <Grid fluid className="layout">
            <Row>
              <Col md={8}>
                {this.props.BingMapKey ? <DeviceMap {...deviceMapProps} /> : null}
              </Col>
              <Col md={4}>
                <AlarmList {...alarmListProps} />
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Telemetry {...telemetryProps} />
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
    mapControlDataLoading : state.deviceReducer.mapControlDataLoading,
    telemetryByDeviceGroup: state.deviceReducer.telemetryByDeviceGroup,
    devices: state.deviceReducer.devices,
    BingMapKey: state.mapReducer.BingMapKey,
    alarmList: state.deviceReducer.alarmsList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
