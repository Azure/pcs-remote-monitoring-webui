// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { PcsGrid } from 'components/shared';
import { translateColumnDefs, getStatusCode } from 'utilities';
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
    headerName: 'maintenance.jobStatusGrid.deviceIdAffected',
    field: 'devices',
    valueFormatter: ({ value = [] }) => value.map(({ deviceId }) => deviceId).join(', ')
  },
  {
    headerName: 'maintenance.jobStatusGrid.lastReturnMsg',
    field: 'status',
    valueFormatter: ({ value, data = {}, context: { t } }) => data.methodName ? `${data.methodName} ${getStatusCode(value, t)}` : getStatusCode(value, t)
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

export const JobStatusGrid = ({ t, ...props }) => {
  const gridProps = {
    columnDefs: translateColumnDefs(t, columnDefs),
    context: { t },
    sizeColumnsToFit: true,
    ...props
  };
  return (
    <PcsGrid {...gridProps} />
  )
};
