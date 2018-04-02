// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { PcsGrid } from 'components/shared';
import { isFunc, translateColumnDefs, renderUndefined } from 'utilities';
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
    headerName: 'Operation', // TODO: Translate
    field: 'methodName'
  },
  {
    headerName: 'No. of Devices', // TODO: Translate
    field: 'stats.deviceCount',
    valueFormatter: ({ value }) => renderUndefined(value)
  }
  ,
  {
    headerName: 'Succeeded', // TODO: Translate
    field: 'stats.succeededCount',
    valueFormatter: ({ value }) => renderUndefined(value)
  },
  {
    headerName: 'Failed', // TODO: Translate
    field: 'stats.failedCount',
    valueFormatter: ({ value }) => renderUndefined(value)
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
