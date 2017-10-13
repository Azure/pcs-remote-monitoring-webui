// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PcsGrid from '../pcsGrid/pcsGrid';
import { systemStatusColumnDefs, systemStatusGridProps } from './systemStatusConfig';
import './systemStatusGrid.css';

class SystemStatusGrid extends Component {
  constructor(props) {
    super(props);

    // Default system status grid columns
    this.columnDefs = [
      systemStatusColumnDefs.jobId,
      systemStatusColumnDefs.status,
      systemStatusColumnDefs.type,
      systemStatusColumnDefs.deviceCount,
      systemStatusColumnDefs.succeededCount,
      systemStatusColumnDefs.failedCount,
      systemStatusColumnDefs.startTime,
      systemStatusColumnDefs.endTime
    ];

    this.onGridReady = this.onGridReady.bind(this);
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady(gridReadyEvent) {
    this.gridApi = gridReadyEvent.api;
    this.columnApi = gridReadyEvent.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <div className="system-grid-container">
        <PcsGrid
          /* systemStatusGridProps Properties */
          {...systemStatusGridProps} // Default systemStatusGrid options
          columnDefs={this.columnDefs}
          rowData={this.props.jobs}
          /* Grid Events */
          onSoftSelectChange={this.props.onSoftSelectChange}
          onGridReady={this.onGridReady}
        />
      </div>
    );
  }
}

export default SystemStatusGrid;
