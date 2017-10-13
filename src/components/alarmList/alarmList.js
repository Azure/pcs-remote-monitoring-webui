// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Rx from 'rxjs';

import lang from '../../common/lang';
import ApiService from '../../common/apiService';
import DashboardPanel from '../dashboardPanel/dashboardPanel';
import AlarmsGrid from './alarmsGrid';
import Config from '../../common/config';
import RxEventSwitchManager from '../../common/rxEventSwitchManager';

import './alarmList.css';

class AlarmList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRange: this.props.timeRange || 'PT1H',
      rowData: [],
      loading: false,
      deviceIdList: ''
    };

    this.eventManager = new RxEventSwitchManager();
  }

  componentDidMount() {
    // Start listening to the refresh streams to update the row data
    // After each call, kick off a refresh after waiting TELEMETRY_UPDATE_MS
    this.refreshSubscription = 
      this.eventManager
        .stream
        .do(_ => this.refresh(`intervalRefresh`, Config.INTERVALS.TELEMETRY_UPDATE_MS))
        .subscribe(
          rowData => this.setState({ rowData, loading: false }),
          err => this.setState({ loading: false })
        );
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady = gridReadyEvent => {
    gridReadyEvent.api.sizeColumnsToFit();
  }

  componentWillUnmount() {
    this.refreshSubscription.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    // If the device list changes, reload the list data
    const newDeviceIdList = this.generateDeviceIdList(nextProps.devices);
    if (this.state.deviceIdList !== newDeviceIdList ||
      this.state.timeRange !== nextProps.timeRange) {
      this.setState(
        {
          deviceIdList: newDeviceIdList,
          timeRange: nextProps.timeRange
        }, 
        () => this.refresh(`filterGroupRefresh`)
      );
    }
  }

  onTimeRangeChange(selectedOption) {
    if (!selectedOption) return;
    this.setState({ timeRange: selectedOption.value }, () => this.refresh(`timeRangeRefresh`));
  }

  generateDeviceIdList(devices) {
    return devices.map(id => encodeURIComponent(id)).join(',');
  }

  dataFormatter = ({ Items }) => {
    return Items.map(item => ({
      ruleId: item.Rule.Id,
      created: item.Created,
      occurrences: item.Count,
      description: item.Rule.Description,
      severity: item.Rule.Severity,
      status: item.Status
    }));
  };

  createGetDataEvent = (eventName) => {
    this.setState({ loading: true });
    return Rx.Observable.of(this.state)
      .filter(({ deviceIdList }) => deviceIdList) // Don't make the call if device id list is not defined
      .flatMap(({ timeRange, deviceIdList }) => 
        Rx.Observable.fromPromise(
          ApiService.getAlarmsByRule({
            from: `NOW-${timeRange}`,
            to: 'NOW',
            devices: deviceIdList
          })
        )
      )
      .map(this.dataFormatter);
  };

  refresh(eventName, delayAmount) {
    this.eventManager.emit(eventName, this.createGetDataEvent, delayAmount);
  }

  render() {
    const alarmsGridProps = { rowData: this.state.rowData };
    return (
      <DashboardPanel
        className="alarm-list"
        showHeaderSpinner={this.state.loading}
        title={lang.ALARMSTATUS}>
          <div className="grid-container">
            <AlarmsGrid {...alarmsGridProps} />
          </div>
      </DashboardPanel>
    );
  }
}

export default AlarmList;
