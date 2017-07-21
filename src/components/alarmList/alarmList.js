// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import EventTopic, { Topics } from '../../common/eventtopic';
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import SearchableDataGrid from '../../framework/searchableDataGrid/searchableDataGrid';
import Config from '../../common/config';

import './alarmList.css';

const DEFAULT_GRIDHEIGHT = 100;

class AlarmList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridHeight: DEFAULT_GRIDHEIGHT,
      columnDefs: this.createColumnDefs()
    };
  }

  createColumnDefs = () => {
    return [
      { headerName: 'RuleID', field: 'ruleId', filter: 'text' },
      { headerName: 'Occurrences', field: 'occurrences', filter: 'number' },
      { headerName: 'Description', field: 'description', filter: 'text' },
      { headerName: 'Severity', field: 'severity', filter: 'text' },
      { headerName: 'LastIncidentUtc', field: 'lastIncident', filter: 'date' },
      { headerName: 'Status', field: 'status', filter: 'text' }
    ];
  };

  static hookWindowResize() {
    (function() {
      let isRunning = false;
      window.addEventListener('resize', function() {
        if (isRunning) {
          return;
        }
        isRunning = true;
        requestAnimationFrame(function() {
          window.dispatchEvent(new CustomEvent('layoutResize'));
          isRunning = false;
        });
      });
    })();
  }

  componentDidMount() {
    AlarmList.hookWindowResize();
    window.addEventListener('layoutResize', this.resize);
    this.setState({
      gridHeight:
        this.refs.container.clientHeight - this.refs.dropdown.clientHeight - 10
    });
  }

  componentWillUnmount() {
    EventTopic.unsubscribe(this.tokens);
  }

  onEvent = (topic, data) => {
    this.setState({ currentFilter: data }, () => {
      this.getData(data);
    });
  };

  resize = () => {
    this.setState({
      gridHeight:
        this.refs.container.clientHeight - this.refs.dropdown.clientHeight - 10
    });
  };

  render() {
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
                  id: 'P1M',
                  text: 'Last 1 month'
                },
                {
                  id: 'P3M',
                  text: 'Last 3 month'
                },
                {
                  id: 'P6M',
                  text: 'Last 6 month'
                },
                {
                  id: 'P1Y',
                  text: 'Last 1 year'
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
          datasource={`${Config.solutionApiUrl}api/v1/alarm/{timerange}`}
          urlSearchPattern="/\{timerange\}/i"
          topics={[Topics.dashboard.alarmTimerange.selected]}
          enableSorting={true}
          enableSearch={false}
          enableFilter={true}
          autoLoad={true}
          multiSelect={false}
          title=""
          showLastUpdate={false}
        />
      </div>
    );
  }
}

export default AlarmList;
