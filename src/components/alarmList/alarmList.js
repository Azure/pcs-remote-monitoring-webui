// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Rx from 'rxjs';

import lang from '../../common/lang';
import ApiService from '../../common/apiService';
import DashboardPanel from '../dashboardPanel/dashboardPanel';
import AlarmsGrid from './alarmsGrid';
import Config from '../../common/config';
import PollingManager from '../../common/pollingManager';

import './alarmList.css';

class AlarmList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeRange: this.props.timeRange || 'PT1H',
      rowData: undefined,
      loading: false,
      deviceIdList: '',
      error: ''
    };

    this.pollingManager = new PollingManager();
    this.rulesAndActionsEmitter = new Rx.BehaviorSubject(undefined);
    this.rulesAndActionsStream = this.rulesAndActionsEmitter
      .filter(_ => _)
      .distinct()
      .map(rulesAndActions => rulesAndActions.reduce((acc, { Id, Name }) => ({ ...acc, [Id]: Name }), {}));
  }

  componentDidMount() {
    if (this.props.rulesAndActions) {
      this.rulesAndActionsEmitter.next(this.props.rulesAndActions);
    }
    // Start listening to the refresh streams to update the row data
    // After each call, kick off a refresh after waiting TELEMETRY_UPDATE_MS
    this.refreshSubscription = this.pollingManager.stream
      .combineLatest(this.rulesAndActionsStream, (data, ruleIdNameMap) => ({ alarms: data.Items, ruleIdNameMap }))
      .flatMap(({ alarms, ruleIdNameMap }) =>
        Rx.Observable
          .from(alarms)
          .map(alarm => ({
            ruleName: ruleIdNameMap[alarm.Rule.Id] || alarm.Rule.Id,
            created: alarm.Created,
            occurrences: alarm.Count,
            description: alarm.Rule.Description,
            severity: alarm.Rule.Severity,
            status: alarm.Status
          }))
          .reduce((acc, curr) => [...acc, curr], [])
      )
      .do(_ => this.refresh(`intervalRefresh`, Config.INTERVALS.TELEMETRY_UPDATE_MS))
      .subscribe(
        rowData => this.setState({ rowData, loading: false }),
        error => this.setState({ error, loading: false })
      );
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady = gridReadyEvent => gridReadyEvent.api.sizeColumnsToFit();

  componentWillUnmount() {
    this.refreshSubscription.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    // If the device list changes, reload the list data
    const newDeviceIdList = this.generateDeviceIdList(nextProps.devices);
    if (this.state.deviceIdList !== newDeviceIdList) {
      this.setState({ deviceIdList: newDeviceIdList, rowData: undefined }, () => this.refresh() );
    }

    if (this.state.timeRange !== nextProps.timeRange) {
      this.setState({ timeRange: nextProps.timeRange, rowData: undefined }, () => this.refresh() );
    }

    if (nextProps.rulesAndActions) {
      this.rulesAndActionsEmitter.next(nextProps.rulesAndActions);
    }
  }

  generateDeviceIdList(devices) {
    return devices.map(id => encodeURIComponent(id)).join(',');
  }

  createGetDataEvent = eventName => {
    this.setState({ loading: true });
    return (
      Rx.Observable
        .of(this.state)
        .flatMap(({ timeRange, deviceIdList }) =>
          ApiService.getAlarmsByRule({
            from: `NOW-${timeRange}`,
            to: 'NOW',
            devices: deviceIdList
          })
        )
    );
  };

  refresh(eventName, delayAmount) {
    this.pollingManager.emit(eventName, this.createGetDataEvent, delayAmount);
  }

  render() {
    // Pass an empty string to avoid two spinners appearing on top of each other
    const alarmsGridProps = { rowData: this.state.rowData || [] };

    return (
      <DashboardPanel
        className="alarm-list"
        showNoDataOverlay={!(this.state.rowData && this.state.rowData.length)}
        showHeaderSpinner={this.state.loading}
        showContentSpinner={!this.state.rowData && !this.state.error}
        error={this.state.error}
        title={lang.ALARMSTATUS}>
        <div className="grid-container">
          <AlarmsGrid {...alarmsGridProps} />
        </div>
      </DashboardPanel>
    );
  }
}

export default AlarmList;
