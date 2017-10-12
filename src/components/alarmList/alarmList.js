// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Rx from 'rxjs';

import lang from '../../common/lang';
import ApiService from '../../common/apiService';
import DashboardPanel from '../dashboardPanel/dashboardPanel';
import AlarmsGrid from './alarmsGrid';
import Config from '../../common/config';

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

    // Event subjects: used to create events
    this.refreshEvents = new Rx.Subject();
    this.delayedRefreshEvents = new Rx.Subject();
    // Event streams: converts events into actual service call observables
    this.refreshStream = this.refreshEvents
      .map(this.createGetDataEvent);
    this.delayedRefreshStream = this.delayedRefreshEvents
      .map(eventName => 
        Rx.Observable.of(eventName)
          .delay(Config.INTERVALS.TELEMETRY_UPDATE_MS)
          .flatMap(this.createGetDataEvent)
      );
  }

  componentDidMount() {
    // Start listening to the refresh streams to update the row data
    this.refreshSubscription = 
      this.refreshStream
        .merge(this.delayedRefreshStream)
        .switch() // Only take the latest event
        .do(_ => this.delayedRefreshEvents.next(`intervalRefresh`)) // After each call, kick off a refresh
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
        () => this.refreshEvents.next(`filterGroupRefresh`)
      );
    }
  }

  onTimeRangeChange(selectedOption) {
    if (!selectedOption) return;
    this.setState({ timeRange: selectedOption.value }, () => this.refreshEvents.next(`timeRangeRefresh`));
  }

  generateDeviceIdList(devices) {
    return devices.map(id => encodeURIComponent(id)).join(',');
  }

  dataFormatter = ({ Items }) => {
    return Items.map(item => {
      return {
        ruleId: item.Rule.Id,
        created: item.Created,
        occurrences: item.Count,
        description: item.Rule.Description,
        severity: item.Rule.Severity,
        status: item.Status
      };
    });
  };

  createGetDataEvent = (eventName) => {
    this.setState({ loading: true });
    return Rx.Observable.fromPromise(
        ApiService.getAlarmsByRule({
          from: `NOW-${this.state.timeRange}`,
          to: 'NOW',
          devices: this.state.deviceIdList
        })
      )
      .map(this.dataFormatter);
  };

  render() {
    const alarmsGridProps = { rowData: this.state.rowData };

    return (
      <DashboardPanel
        className="alarm-list"
        indicator= {this.state.loading}
        title={lang.ALARMSTATUS}>
          <div className="grid-container">
            <AlarmsGrid {...alarmsGridProps} />
          </div>
      </DashboardPanel>
    );
  }
}

export default AlarmList;
