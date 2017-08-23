// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchableDataGrid from '../../framework/searchableDataGrid/searchableDataGrid';
import lang from '../../common/lang';
import Select from 'react-select';
import ApiService from '../../common/apiService';
import Rx from 'rxjs';

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
  }

  createColumnDefs = () => {
    let columnDefs = lang.DASHBOARD.ALARMLIST.COLUMNDEFS;
    return [
      { headerName: columnDefs.RULENAME, field: 'ruleId', filter: 'text' },
      { headerName: columnDefs.SEVERITY, field: 'severity', filter: 'text' },
      { headerName: columnDefs.CREATED, field: 'created', filter: 'date' },
      { headerName: columnDefs.OPENOCCURRENCES, field: 'occurrences', filter: 'number' },
      { headerName: columnDefs.DESCRIPTION, field: 'description', filter: 'text' },
      { headerName: columnDefs.STATUS, field: 'status', filter: 'text' }
    ];
  };

  componentDidMount() {
    // Initialize the grid
    this.getData();
    this.subscriptions.push(
      Rx.Observable.interval(2000).subscribe(_ => this.getData(false))
    );
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
      err => this.setState({ loading: false })
    );
  };

  render() {
    return (
      <div ref="container" className="alarm-list">
        <div className="alarm-list-header">
          <span>{lang.DASHBOARD.ALARMSTATUS}</span>
          <div ref="dropdown" className="alarm-dropdown">
            <Select
              value={this.state.timerange}
              onChange={this.onTimeRangeChange.bind(this)}
              searchable={false}
              options={[
                {
                  value: 'PT1H',
                  label: lang.FORMS.LASTHOUR
                },
                {
                  value: 'P1D',
                  label: lang.FORMS.LASTDAY
                },
                {
                  value: 'P1W',
                  label: lang.FORMS.LASTWEEK
                },
                {
                  value: 'P1M',
                  label: lang.FORMS.LASTMONTH
                }
              ]}
              />
          </div>
        </div>
        <div className="grid-container">
          <SearchableDataGrid
            // properties
            columnDefs={this.state.columnDefs}
            paginationAutoPageSize={true}
            suppressScrollOnNewData={true}
            pagination={false}
            rowData={this.state.rowData}
            loading={this.state.loading}
            enableSorting={false}
            enableSearch={false}
            enableFilter={false}
            autoLoad={false}
            multiSelect={false}
            title=""
            height={400}
            showLastUpdate={false}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const devices =
    state.deviceReducer.devices && state.deviceReducer.devices.items
      ? state.deviceReducer.devices.items
      : [];
  return {
    devices: devices.map(device => device.Id)
  };
};

export default connect(mapStateToProps, undefined)(AlarmList);
