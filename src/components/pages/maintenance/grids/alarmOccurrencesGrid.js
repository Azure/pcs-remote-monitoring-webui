// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { PcsGrid } from 'components/shared';
import { translateColumnDefs } from 'utilities';
import { rulesColumnDefs, checkboxParams } from 'components/pages/rules/rulesGrid/rulesGridConfig';
import { LastTriggerRenderer } from 'components/shared/cellRenderers';

const columnDefs = [
  {
    ...checkboxParams,
    headerName: 'Occurrence', // TODO: Translate
    field: 'name'
  },
  rulesColumnDefs.description,
  rulesColumnDefs.severity,
  {
    headerName: 'Trigger Device', // TODO: Translate
    field: 'deviceId'
  },
  {
    headerName: 'Time', // TODO: Translate
    field: 'dateCreated',
    cellRendererFramework: LastTriggerRenderer
  },
  {
    headerName: 'Status', // TODO: Translate
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
