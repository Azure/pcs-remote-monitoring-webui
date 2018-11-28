// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { TimeRenderer, SoftSelectLinkRenderer } from 'components/shared/cellRenderers';
import { gridValueFormatters } from 'components/shared/pcsGrid/pcsGridConfig';
import { getPackageTypeTranslation, getConfigTypeTranslation } from 'utilities';

const { checkForEmpty } = gridValueFormatters;

export const packagesColumnDefs = {
  name: {
    headerName: 'packages.grid.name',
    field: 'name',
    sort: 'asc',
    valueFormatter: ({ value }) => checkForEmpty(value),
    cellRendererFramework: SoftSelectLinkRenderer
  },
  packageType: {
    headerName: 'packages.grid.packageType',
    field: 'packageType',
    valueFormatter: ({ value, context: { t } }) => getPackageTypeTranslation(checkForEmpty(value), t)
  },
  configType: {
    headerName: 'packages.grid.configType',
    field: 'configType',
    valueFormatter: ({ value, context: { t } }) => getConfigTypeTranslation(checkForEmpty(value), t)
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
