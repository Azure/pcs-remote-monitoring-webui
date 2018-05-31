// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { PcsGrid } from 'components/shared';
import { translateColumnDefs } from 'utilities';
import { rulesColumnDefs } from 'components/pages/rules/rulesGrid/rulesGridConfig';
import { checkboxColumn } from 'components/shared/pcsGrid/pcsGridConfig';

import { TimeRenderer } from 'components/shared/cellRenderers';

const columnDefs = [
  checkboxColumn,
  {
    headerName: 'maintenance.alertOccGrid.occurrence',
    field: 'name'
  },
  rulesColumnDefs.description,
  rulesColumnDefs.severity,
  {
    headerName: 'maintenance.alertOccGrid.triggerDevice',
    field: 'deviceId'
  },
  {
    headerName: 'maintenance.alertOccGrid.time',
    field: 'dateCreated',
    cellRendererFramework: TimeRenderer
  },
  {
    headerName: 'maintenance.jobGrid.status',
    field: 'status',
    cellClass: 'capitalize-cell'
  }
];

export const AlertOccurrencesGrid = ({ t, ...props }) => {
  const gridProps = {
    columnDefs: translateColumnDefs(t, columnDefs),
    context: { t },
    ...props
  };
  return (
    <PcsGrid {...gridProps} />
  );
};
