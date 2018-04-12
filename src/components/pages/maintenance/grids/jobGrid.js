// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { PcsGrid } from 'components/shared';
import { isFunc, translateColumnDefs, renderUndefined, getStatusCode } from 'utilities';
import { TimeRenderer } from 'components/shared/cellRenderers';

const columnDefs = [
  {
    headerName: 'maintenance.jobGrid.jobName',
    field: 'jobId'
  },
  {
    headerName: 'maintenance.jobGrid.status',
    field: 'status',
    valueFormatter: ({ value, context: { t } }) => getStatusCode(value, t)
  },
  {
    headerName: 'maintenance.jobGrid.operation',
    field: 'methodName'
  },
  {
    headerName: 'maintenance.jobGrid.noDevices',
    field: 'stats.deviceCount',
    valueFormatter: ({ value }) => renderUndefined(value)
  }
  ,
  {
    headerName: 'maintenance.jobGrid.succeeded',
    field: 'stats.succeededCount',
    valueFormatter: ({ value }) => renderUndefined(value)
  },
  {
    headerName: 'maintenance.jobGrid.failed',
    field: 'stats.failedCount',
    valueFormatter: ({ value }) => renderUndefined(value)
  },
  {
    headerName: 'maintenance.jobGrid.startTime',
    field: 'startTimeUtc',
    cellRendererFramework: TimeRenderer
  },
  {
    headerName: 'maintenance.jobGrid.endTime',
    field: 'endTimeUtc',
    cellRendererFramework: TimeRenderer
  }
];

export class JobGrid extends Component {

  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
    gridReadyEvent.api.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  }

  render () {
    const { t, ...props } = this.props;
    const gridProps = {
      columnDefs: translateColumnDefs(t, columnDefs),
      context: { t },
      onGridReady: this.onGridReady,
      ...props
    };
    return (
      <PcsGrid {...gridProps} />
    )
  }
}
