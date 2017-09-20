// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import lang from '../../common/lang';
import PcsGrid from '../pcsGrid/pcsGrid';

class AlarmsByRuleGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: lang.NAME, field: 'name', filter: 'text' },
        { headerName: lang.DESCRIPTION, field: 'description', filter: 'text' },
        { headerName: lang.SEVERITY, field: 'severity', filter: 'text' },
        { headerName: lang.TOTAL_OCCRRENCES, field: 'total_occrrences', filter: 'text' },
        { headerName: lang.OPEN_OCCRRENCES, field: 'open_occrrences', filter: 'text' },
        { headerName: lang.ACK_OCCRRENCES, field: 'ack_occrrences', filter: 'text' },
        { headerName: lang.CLOSE_OCCRRENCES, field: 'close_occrrences', filter: 'text' },
        { headerName: lang.LAST_OCCRRENCES, field: 'last_occrrences', filter: 'text' },
      ],
      timerange: 'PT1H',
      rowData: [],
      loading: true,
      deviceIdList: '',
      alarmsByRule: {}
    };
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady = gridReadyEvent => {
    gridReadyEvent.api.sizeColumnsToFit();
  }

  /** When a row is selected, redirect to rule details page */
  onRowClicked = ({ data }) => {
    const ruleId = data.id;
    browserHistory.push({
      pathname: `/maintenance/rule/${ruleId}`
    });
  };

  render() {
    return (
      <PcsGrid
        columnDefs={this.state.columnDefs}
        pagination={true}
        paginationAutoPageSize={true}
        suppressScrollOnNewData={true}
        paginationPageSize={8}
        rowData={this.props.rowData}
        enableSorting={false}
        enableSearch={false}
        enableFilter={false}
        multiSelect={false}
        showLastUpdate={false}
        enableColResize={true}
        onRowClicked={this.onRowClicked}
        suppressMovableColumns={true}
        onGridReady={this.onGridReady}
      />
    );
  }
}

export default AlarmsByRuleGrid;
