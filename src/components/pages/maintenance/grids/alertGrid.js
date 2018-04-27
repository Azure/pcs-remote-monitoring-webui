// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { PcsGrid } from 'components/shared';
import { translateColumnDefs } from 'utilities';
import { rulesColumnDefs } from 'components/pages/rules/rulesGrid/rulesGridConfig';
import { TimeRenderer } from 'components/shared/cellRenderers';

const columnDefs = [
  rulesColumnDefs.ruleName,
  rulesColumnDefs.description,
  rulesColumnDefs.severity,
  {
    headerName: 'maintenance.alertGrid.totalCount',
    field: 'counts.total'
  },
  {
    headerName: 'maintenance.alertGrid.open',
    field: 'counts.open'
  },
  {
    headerName: 'maintenance.alertGrid.acknowledged',
    field: 'counts.acknowledged'
  },
  {
    headerName: 'maintenance.alertGrid.closed',
    field: 'counts.closed'
  },
  {
    headerName: 'maintenance.alertGrid.lastOccurrence',
    field: 'lastOccurrence',
    cellRendererFramework: TimeRenderer
  }
];

export const AlertGrid = ({ t, ...props }) => {
  const gridProps = {
    columnDefs: translateColumnDefs(t, columnDefs),
    context: { t },
    sizeColumnsToFit: true,
    ...props
  };
  return (
    <PcsGrid {...gridProps} />
  );
};
