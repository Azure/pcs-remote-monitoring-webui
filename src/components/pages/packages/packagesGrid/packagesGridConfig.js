// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';

export const packagesColumnDefs = {
 // TODO
};

export const defaultPackagesGridProps = {
  enableColResize: true,
  multiSelect: true,
  pagination: true,
  paginationPageSize: Config.paginationPageSize,
  rowSelection: 'multiple'
};
