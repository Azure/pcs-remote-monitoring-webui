// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import lang from '../../common/lang';
import PcsGrid from '../pcsGrid/pcsGrid';
import SeverityCellRenderer from '../cellRenderers/severityCellRenderer/severityCellRenderer';

const defaultAlarmsByRuleGridProps = {
  pagination: true,
  paginationAutoPageSize: true,
  suppressScrollOnNewData: true,
  paginationPageSize: 8,
  enableSorting: false,
  enableSearch: false,
  enableFilter: false,
  multiSelect: false,
  showLastUpdate: false,
  enableColResize: true,
  suppressMovableColumns: true
};

class AlarmsByRuleGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timerange: 'PT1H',
      rowData: null,
      loading: true,
      deviceIdList: '',
      alarmsByRule: {}
    };

    this.defaultcolumnDefs = [
      { headerName: lang.NAME, field: 'name', filter: 'text' },
      { headerName: lang.DESCRIPTION, field: 'description', filter: 'text' },
      {
        headerName: lang.SEVERITY,
        field: 'severity',
        filter: 'text',
        cellRendererFramework: SeverityCellRenderer
      },
      { headerName: lang.TOTAL_COUNT, field: 'total_occrrences', filter: 'text' },
      { headerName: lang.OPEN, field: 'open_occrrences', filter: 'text' },
      { headerName: lang.ACK, field: 'ack_occrrences', filter: 'text' },
      { headerName: lang.CLOSED, field: 'close_occrrences', filter: 'text' },
      { headerName: lang.LAST_OCCRRENCES, field: 'last_occrrences', filter: 'text' }
    ];
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady = gridReadyEvent => {
    gridReadyEvent.api.sizeColumnsToFit();
  };

  /** When a row is selected, redirect to rule details page */
  onRowClicked = ({ data }) => {
    const ruleId = data.id;
    browserHistory.push({
      pathname: `/maintenance/rule/${ruleId}`
    });
  };

  render() {
    const gridProps = {
      ...defaultAlarmsByRuleGridProps,
      columnDefs: this.defaultcolumnDefs,
      ...this.props,
      onRowClicked: this.onRowClicked,
      onGridReady: this.onGridReady
    };

    return <PcsGrid {...gridProps} />;
  }
}

export default AlarmsByRuleGrid;
