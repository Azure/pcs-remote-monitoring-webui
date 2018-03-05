// Copyright (c) Microsoft. All rights reserved.

import moment from 'moment';
import Config from 'app.config';
import { IsSimulatedRenderer, ConnectionStatusRenderer } from 'components/shared/cellRenderers';
import { EMPTY_FIELD_VAL, DEFAULT_TIME_FORMAT, gridValueFormatters } from 'components/shared/pcsGrid/pcsGridConfig';

const { checkForEmpty } = gridValueFormatters;

export const checkboxParams = {
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true
};

/** A collection of column definitions for the devices grid */
export const deviceColumnDefs = {
  id: {
    headerName: 'Device Name',
    field: 'id',
    sort: 'asc'
  },
  isSimulated: {
    headerName: 'Simulated',
    field: 'isSimulated',
    cellRendererFramework: IsSimulatedRenderer
  },
  deviceType: {
    headerName: 'Device Type',
    field: 'type',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  firmware: {
    headerName: 'Firmware',
    field: 'firmware',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  telemetry: {
    headerName: 'Telemetry',
    field: 'telemetry',
    valueFormatter: ({ value }) => Object.keys(value || {}).join('; ') || EMPTY_FIELD_VAL
  },
  status: {
    headerName: 'Status',
    field: 'connected',
    cellRendererFramework: ConnectionStatusRenderer
  },
  lastConnection: {
    headerName: 'Last Connection',
    field: 'lastActivity',
    valueFormatter: ({ value }) => {
      const time = moment(value);
      return checkForEmpty((time.unix() > 0) ? time.format(DEFAULT_TIME_FORMAT) : '');
    }
  }
};

/** Given a device object, extract and return the device Id */
export const getSoftSelectId = ({ Id }) => Id;

/** Shared device grid AgGrid properties */
export const defaultDeviceGridProps = {
  enableColResize: true,
  multiSelect: true,
  paginationPageSize: Config.paginationPageSize,
  rowSelection: 'multiple'
};
