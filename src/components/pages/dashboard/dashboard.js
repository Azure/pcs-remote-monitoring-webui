// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
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

import './dashboard.css';

class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeRange: 'PT1H',
      lastRefreshed: new Date(),
    };

    this.loadMapData = this.loadMapData.bind(this);
    this.onTimeRangeChange = this.onTimeRangeChange.bind(this);
  }

  componentDidMount() {
    const deviceIds = ((this.props.devices || {}).items || []).map(({Id}) => Id) || [];
    this.props.actions.loadMapkey();
    if (this.props.selectedDeviceGroup === '') {
      // Default query messages and alarms for all devices
      this.props.actions.loadDashboardData(lang.ALLDEVICES, this.state.timeRange);
      this.props.actions.loadTelemetryMessagesByDeviceIds(lang.ALLDEVICES);
    } else {
      this.props.actions.loadTelemetryMessagesByDeviceIds(deviceIds);
      this.loadMapData();
    }
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  loadMapData() {
    const deviceIds = ((this.props.devices || {}).items || []).map(({Id}) => Id) || [];
    this.props.actions.loadDashboardData(deviceIds, this.state.timeRange);
  }

  onTimeRangeChange(selectedOption) {
    if (!selectedOption) return;
    this.setState({
        timeRange: selectedOption.value,
        lastRefreshed: new Date()
      },
      () => this.loadMapData()
    );
  }

  render() {
    const deviceMapProps = {
      alarmList: this.props.alarmList,
      devices: this.props.devices,
      telemetryByDeviceGroup: this.props.telemetryByDeviceGroup,
      BingMapKey: this.props.BingMapKey,
      timeRange: this.state.timeRange
    };

    const devicesList = this.props.devices && this.props.devices.items ? this.props.devices.items : [];
    const devices = devicesList.map(({ Id }) => Id)
    const alarmListProps = {
      devices,
      timeRange: this.state.timeRange
    };
    const telemetryProps = {
      chartId: 'dashboard_telemetry_chart',
      devices: this.props.devices,
    };
    const kpiProps = {
      devices,
      timeRange: this.state.timeRange
    };
    const selectProps = {
      value: this.state.timeRange,
      onChange: this.onTimeRangeChange,
      searchable: false,
      clearable: false,
      options: [
        {
          value: 'PT1H',
          label: lang.LASTHOUR
        },
        {
          value: 'P1D',
          label: lang.LASTDAY
        },
        {
          value: 'P1W',
          label: lang.LASTWEEK
        },
        {
          value: 'P1M',
          label: lang.LASTMONTH
        }
      ]
    };

    return (
      <PageContainer>
        <TopNav breadcrumbs={'Dashboard'} projectName={lang.AZUREPROJECTNAME} />
        <ContextFilters>
          <div className="timerange-selection dashboard">
            <div className="last-refreshed-text"> {`${lang.LAST_REFRESHED} | `} </div>
            <div className="last-refreshed-time">{this.state.lastRefreshed.toLocaleString()}</div>
            <div onClick={this.refreshData} className="refresh-icon icon-sm" />
            <Select {...selectProps} />
          </div>
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
                <Telemetry {...telemetryProps} />
              </Col>
              <Col md={4}>
                <KpiWidget {...kpiProps} />
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
    devices: state.deviceReducer.devices,
    BingMapKey: state.mapReducer.BingMapKey,
    alarmList: state.kpiReducer.alarmsList,
    selectedDeviceGroup: state.filterReducer.selectedDeviceGroupId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
