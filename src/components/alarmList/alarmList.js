// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import lang from '../../common/lang';
import Select from 'react-select';
import ApiService from '../../common/apiService';
import Rx from 'rxjs';
import DashboardPanel from '../dashboardPanel/dashboardPanel';
import PcsGrid from '../pcsGrid/pcsGrid';

import './alarmList.css';

class AlarmList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: this.createColumnDefs(),
      timerange: 'PT1H',
      rowData: [],
      loading: false,
      deviceIdList: ''
    };
    this.subscriptions = [];
    this.errorSubject = new Rx.Subject();
  }

  createColumnDefs = () => {
    return [
      { headerName: lang.RULENAME, field: 'ruleId', filter: 'text' },
      { headerName: lang.SEVERITY, field: 'severity', filter: 'text' },
      { headerName: lang.CREATED, field: 'created', filter: 'date' },
      { headerName: lang.OPENOCCURRENCES, field: 'occurrences', filter: 'number' },
      { headerName: lang.EXPLOREALARM, valueGetter: params => '...' },
    ];
  };

  componentDidMount() {
    // Initialize the grid and start refreshing
    this.subscriptions.push(
      Rx.Observable.interval(2000)
        .startWith(-1)
        .takeUntil(this.errorSubject)
        .subscribe((cnt) => this.getData(cnt < 0))
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  componentWillReceiveProps(nextProps) {
    // If the device list changes, reload the list data
    const newDeviceIdList = this.generateDeviceIdList(nextProps.devices);
    if (this.state.deviceIdList !== newDeviceIdList) {
      this.setState({ deviceIdList: newDeviceIdList }, () => this.getData());
    }
  }

  dataFormatter(data) {
    return data.Items.map(item => {
      return {
        ruleId: item.Rule.Id,
        created: item.Created,
        occurrences: item.Count,
        description: item.Rule.Description,
        severity: item.Rule.Severity,
        status: item.Status
      };
    });
  }

  onTimeRangeChange(selectedOption) {
    if (!selectedOption) return;
    this.setState({ timerange: selectedOption.value }, () => this.getData());
  }

  generateDeviceIdList(devices) {
    return devices.map(id => encodeURIComponent(id)).join(',');
  }

  getData(showLoading = true) {
    // If no device list is provided, do not initialize the alarm list
    // since the device group has not been selected
    if (!this.state.deviceIdList) return;
    if (showLoading) this.setState({ loading: true });
    Rx.Observable.fromPromise(
      ApiService.getAlarmsByRule({
          from: `NOW-${this.state.timerange}`,
          to: 'NOW',
          devices: this.state.deviceIdList
        })
    ).subscribe(
      data => this.setState({
        rowData: this.dataFormatter(data),
        loading: false
      }),
      err => {
        this.setState({ loading: false });
        this.errorSubject.next(undefined);
      }
    );
  };

  render() {
    return (
      <DashboardPanel
        className="alarm-list"
        title={lang.ALARMSTATUS}
        actions={
          <Select
            value={this.state.timerange}
            onChange={this.onTimeRangeChange.bind(this)}
            searchable={false}
            clearable={false}
            options={[
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
            ]}
          />
        }>
          <div className="grid-container">
            <PcsGrid
              columnDefs={this.state.columnDefs}
              paginationAutoPageSize={true}
              suppressScrollOnNewData={true}
              pagination={false}
              rowData={this.state.rowData}
              loading={this.state.loading}
              enableSorting={false}
              enableSearch={false}
              enableFilter={false}
              multiSelect={false}
              showLastUpdate={false}
              suppressCellSelection={true}
              suppressMovableColumns={true}
              onGridReady={this.onGridReady}
            />
          </div>
      </DashboardPanel>
    );
  }
}

export default AlarmList;
