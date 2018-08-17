// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { TimeRenderer } from 'components/shared/cellRenderers';
import { gridValueFormatters } from 'components/shared/pcsGrid/pcsGridConfig';

const { checkForEmpty } = gridValueFormatters;

export const packagesColumnDefs = {
  name: {
    headerName: 'packages.grid.name',
    field: 'name',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  type: {
    headerName: 'packages.grid.type',
    field: 'type',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  dateCreated: {
    headerName: 'packages.grid.dateCreated',
    field: 'dateCreated',
    cellRendererFramework: TimeRenderer
  }
};

export const defaultPackagesGridProps = {
  enableColResize: true,
  multiSelect: true,
  pagination: true,
  paginationPageSize: Config.paginationPageSize,
  rowSelection: 'multiple'
};
