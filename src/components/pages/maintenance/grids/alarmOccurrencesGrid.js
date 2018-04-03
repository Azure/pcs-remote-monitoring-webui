// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { PcsGrid } from 'components/shared';
import { translateColumnDefs } from 'utilities';
import { rulesColumnDefs, checkboxParams } from 'components/pages/rules/rulesGrid/rulesGridConfig';
import { TimeRenderer } from 'components/shared/cellRenderers';

const columnDefs = [
  {
    ...checkboxParams,
    headerName: 'maintenance.alarmOccGrid.occurrence',
    field: 'name'
  },
  rulesColumnDefs.description,
  rulesColumnDefs.severity,
  {
    headerName: 'maintenance.alarmOccGrid.triggerDevice',
    field: 'deviceId'
  },
  {
    headerName: 'maintenance.alarmOccGrid.time',
    field: 'dateCreated',
    cellRendererFramework: TimeRenderer
  },
  {
    headerName: 'maintenance.jobGrid.status',
    field: 'status'
  }
];

export const AlarmOccurrencesGrid = ({ t, ...props }) => {
  const gridProps = {
    columnDefs: translateColumnDefs(t, columnDefs),
    context: { t },
    ...props
  };
  return (
    <PcsGrid {...gridProps} />
  );
};
