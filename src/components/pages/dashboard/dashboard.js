// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Rx from 'rxjs';
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

    this.emitter = new Rx.Subject();
    this.loadMapData = this.loadMapData.bind(this);
    this.onTimeRangeChange = this.onTimeRangeChange.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    const deviceIds = ((this.props.devices || {}).items || []).map(({Id}) => Id) || [];
    this.props.actions.loadRulesList();
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

  loadRefreshData(){
     this.loadMapData();
     this.props.actions.refreshAllChartData();
     this.emitter.next('dashboardRefresh');
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

  refreshData() {
    this.setState(
      { lastRefreshed: new Date() },
      () => this.loadRefreshData()
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
      timeRange: this.state.timeRange,
      dashboardRefresh: this.emitter,
      rulesAndActions: this.props.rulesAndActions
    };
    const telemetryProps = {
      chartId: 'dashboard_telemetry_chart',
      devices: this.props.devices,
    };
    const kpiProps = {
      devices,
      alarmList: this.props.alarmList,
      alarmsByRule: this.props.alarmsByRule,
      timeRange: this.state.timeRange,
      rulesAndActions: this.props.rulesAndActions
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
          value: 'P7D',
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
            <div className="time-icon icon-sm" />
            <Select {...selectProps} />
          </div>
          <ManageFilterBtn />
        </ContextFilters>
        <PageContent>
          <Grid fluid className="layout">
            <Row>
              <Col md={7}>
                <DeviceMap {...deviceMapProps} />
              </Col>
              <Col md={5}>
                <AlarmList {...alarmListProps} />
              </Col>
            </Row>
            <Row>
              <Col md={7}>
                <Telemetry {...telemetryProps} />
              </Col>
              <Col md={5}>
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
    selectedDeviceGroup: state.filterReducer.selectedDeviceGroupId,
    alarmList: state.kpiReducer.alarmsList,
    alarmListLastDuration: state.kpiReducer.alarmListLastDuration,
    alarmsByRule: state.kpiReducer.alarmsByRule,
    alarmsByRuleLastDuration: state.kpiReducer.alarmsByRuleLastDuration,
    rulesAndActions: state.ruleReducer.rulesAndActions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
