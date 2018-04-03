// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { PcsGrid } from 'components/shared';
import { isFunc, translateColumnDefs, getStatusCode } from 'utilities';
import { TimeRenderer } from 'components/shared/cellRenderers';

export const columnDefs = [
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
    headerName: 'maintenance.jobStatusGrid.deviceIdAffected',
    field: 'devices',
    valueFormatter: ({ value = [] }) => value.map(({ deviceId }) => deviceId).join(', ')
  },
  {
    headerName: 'maintenance.jobStatusGrid.lastReturnMsg',
    field: 'status',
    valueFormatter: ({ value, data = {}, context: { t } }) => `${data.methodName} ${getStatusCode(value, t)}`
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

export class JobStatusGrid extends Component {

  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
    gridReadyEvent.api.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  }

  render() {
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
