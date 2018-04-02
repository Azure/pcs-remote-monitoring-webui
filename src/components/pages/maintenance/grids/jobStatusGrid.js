// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { PcsGrid } from 'components/shared';
import { isFunc, translateColumnDefs } from 'utilities';
import { LastTriggerRenderer } from 'components/shared/cellRenderers';

// TODO: Move to central location after translation story is finalized
export const getStatusCode = code => {
  switch (code) {
    case 1: return 'Enqueued'; // TODO: translate
    case 2: return 'Running';
    case 3: return 'Completed';
    case 4: return 'Failed';
    case 5: return 'Cancelled';
    case 6: return 'Scheduled';
    default: return 'Queued';
  }
}

export const columnDefs = [
  {
    headerName: 'Job Name', // TODO: Translate
    field: 'jobId'
  },
  {
    headerName: 'Status', // TODO: Translate
    field: 'status',
    valueFormatter: ({ value }) => getStatusCode(value)
  },
  {
    headerName: 'Device ID Affected', // TODO: Translate
    field: 'devices',
    valueFormatter: ({ value = [] }) => value.map(({ deviceId }) => deviceId).join(', ')
  },
  {
    headerName: 'Last Return Message', // TODO: Translate
    field: 'status',
    valueFormatter: ({ value, data = {} }) => `${data.methodName} ${getStatusCode(value)}` // getStatusCode(value)
  },
  {
    headerName: 'Start Time', // TODO: Translate
    field: 'startTimeUtc',
    cellRendererFramework: LastTriggerRenderer
  },
  {
    headerName: 'End Time', // TODO: Translate
    field: 'endTimeUtc',
    cellRendererFramework: LastTriggerRenderer
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
