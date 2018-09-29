// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { TimeRenderer } from 'components/shared/cellRenderers';
import { gridValueFormatters } from 'components/shared/pcsGrid/pcsGridConfig';

const { checkForEmpty } = gridValueFormatters;

export const deploymentDetailsColumnDefs = {
  name: {
    headerName: 'deployments.details.grid.name',
    field: 'id',
    sort: 'asc',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  deploymentStatus: {
    headerName: 'deployments.details.grid.deploymentStatus',
    field: 'deploymentStatus',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  firmware: {
    headerName: 'deployments.details.grid.firmware',
    field: 'firmware',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  lastMessage: {
    headerName: 'deployments.details.grid.lastMessage',
    field: 'lastMessage',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  start: {
    headerName: 'deployments.details.grid.start',
    field: 'start',
    cellRendererFramework: TimeRenderer
  },
  end: {
    headerName: 'deployments.details.grid.end',
    field: 'end',
    cellRendererFramework: TimeRenderer
  }
};

export const defaultDeploymentDetailsGridProps = {
  enableColResize: true,
  pagination: true,
  paginationPageSize: Config.paginationPageSize,
  sizeColumnsToFit: true,
  deltaRowDataMode: true,
  enableSorting: true,
  unSortIcon: true,
  domLayout: 'autoHeight'
};
