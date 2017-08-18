// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventTopic, { Topics } from '../../common/eventtopic';
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import SearchableDataGrid from '../../framework/searchableDataGrid/searchableDataGrid';
import Config from '../../common/config';

import './alarmList.css';

class AlarmList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: this.createColumnDefs()
    };
  }

  createColumnDefs = () => {
    return [
      { headerName: 'Rule Name', field: 'ruleId', filter: 'text' },
      { headerName: 'Severity', field: 'severity', filter: 'text' },
      { headerName: 'Created', field: 'created', filter: 'date' },
      {
        headerName: 'Open Occurrences',
        field: 'occurrences',
        filter: 'number'
      },
      { headerName: 'Description', field: 'description', filter: 'text' },
      { headerName: 'Status', field: 'status', filter: 'text' }
    ];
  };

  componentWillUnmount() {
    EventTopic.unsubscribe(this.tokens);
  }

  onEvent = (topic, data) => {
    this.setState({ currentFilter: data }, () => {
      this.getData(data);
    });
  };

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

  render() {
    const devicesList = this.props.devices
      .map(id => encodeURIComponent(id))
      .join(',');
    const devicesListParam = devicesList ? `&devices=${devicesList}` : '';
    return (
      <div ref="container" className="alarm-list">
        <div className="alarm-list-header">
          <span>Alarm Status</span>
          <div ref="dropdown" className="alarm-dropdown">
            <GenericDropDownList
              ref="dropdown"
              id="AlarmTimeRange"
              items={[
                {
                  id: 'PT1H',
                  text: 'Last hour'
                },
                {
                  id: 'P1D',
                  text: 'Last day'
                },
                {
                  id: 'P1W',
                  text: 'Last week'
                },
                {
                  id: 'P1M',
                  text: 'Last month'
                }
              ]}
              initialState={{
                defaultText: 'Choose time range',
                selectFirstItem: true
              }}
              publishTopic={Topics.dashboard.alarmTimerange.selected}
            />
          </div>
        </div>
        <SearchableDataGrid
          // properties
          columnDefs={this.state.columnDefs}
          paginationAutoPageSize={true}
          pagination={true}
          eventDataKey="0"
          datasource={`${Config.telemetryApiUrl}alarmsbyrule?from=NOW-{timerange}&to=NOW${devicesListParam}`}
          dataFormatter={this.dataFormatter}
          urlSearchPattern="/\{timerange\}/i"
          topics={[Topics.dashboard.alarmTimerange.selected]}
          enableSorting={true}
          enableSearch={false}
          enableFilter={true}
          autoLoad={true}
          multiSelect={false}
          title=""
          height={400}
          showLastUpdate={false}
        />
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
