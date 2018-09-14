// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { TimeRenderer } from 'components/shared/cellRenderers';
import { gridValueFormatters } from 'components/shared/pcsGrid/pcsGridConfig';

const { checkForEmpty } = gridValueFormatters;

export const deploymentsColumnDefs = {
  name: {
    headerName: 'deployments.grid.name',
    field: 'name',
    sort: 'asc',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  package: {
    headerName: 'deployments.grid.package',
    field: 'packageId',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  deviceGroup: {
    headerName: 'deployments.grid.deviceGroup',
    field: 'deviceGroupId',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  priority: {
    headerName: 'deployments.grid.priority',
    field: 'priority',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  type: {
    headerName: 'deployments.grid.type',
    field: 'type',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  applied: {
    headerName: 'deployments.grid.applied',
    field: 'appliedCount',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  failed: {
    headerName: 'deployments.grid.failed',
    field: 'failedCount',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  succeeded: {
    headerName: 'deployments.grid.succeeded',
    field: 'succeededCount',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  dateCreated: {
    headerName: 'deployments.grid.dateCreated',
    field: 'createdDateTimeUtc',
    cellRendererFramework: TimeRenderer
  }
};

export const defaultDeploymentsGridProps = {
  enableColResize: true,
  pagination: true,
  paginationPageSize: Config.paginationPageSize
};
