// Copyright (c) Microsoft. All rights reserved.

import moment from 'moment';
import lang from '../../common/lang';
import ConnectionStatusRenderer from '../cellRenderers/connectionStatusRenderer/connectionStatusRenderer';
import IsSimulatedRenderer from '../cellRenderers/isSimulatedRenderer/isSimulatedRenderer';

export const EMPTY_FIELD_VAL = '---';
export const DEFAULT_DEVICE_GRID_PAGE_SIZE = 50;

/** A collection of reusable value formatter methods */
export const gridValueFormatters = {
  checkForEmpty: (value, emptyValue = EMPTY_FIELD_VAL) => value || emptyValue
};

export const checkboxParams = {
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true
};

/** A collection of column definitions for the devices grid */
export const deviceColumnDefs = {
  id: {
    headerName: lang.DEVICES.DEVICENAME,
    field: 'Id'
  },
  isSimulated: {
    headerName: lang.DEVICE_DETAIL.SIMULATED,
    field: 'IsSimulated',
    cellRendererFramework: IsSimulatedRenderer
  },
  deviceType: {
    headerName: lang.DEVICES.DEVICETYPE,
    field: 'Tags.deviceType',
    valueFormatter: ({ value }) => gridValueFormatters.checkForEmpty(value)
  },
  firmware: {
    headerName: lang.DEVICE_DETAIL.FIRMWARE,
    field: 'Properties.Reported.Firmware',
    valueFormatter: ({ value }) => gridValueFormatters.checkForEmpty(value)
  },
  telemetry: {
    headerName: lang.DEVICE_DETAIL.TELEMETRY,
    field: 'Properties.Reported.Telemetry',
    valueFormatter: ({ value }) => Object.keys(value || {}).join('; ') || EMPTY_FIELD_VAL
  },
  status: {
    headerName: lang.DEVICE_DETAIL.STATUS,
    field: 'Connected',
    cellRendererFramework: ConnectionStatusRenderer
  },
  lastConnection: {
    headerName: lang.DEVICES.LASTCONNECTION,
    field: 'LastActivity',
    valueFormatter: ({ value }) => {
      const time = moment(value);
      return gridValueFormatters.checkForEmpty((time.unix() > 0) ? time.format("hh:mm:ss MM.DD.YYYY") : '');
    }
  }
};

/** Given a device object, extract and return the device Id */
export const getSoftSelectId = ({ Id }) => Id;

/** Shared device grid AgGrid properties */
export const defaultDeviceGridProps = {
  domLayout: 'autoHeight',
  enableColResize: true,
  multiSelect: true,
  pagination: true,
  paginationPageSize: DEFAULT_DEVICE_GRID_PAGE_SIZE,
  rowSelection: 'multiple',
  suppressCellSelection: true,
  suppressClickEdit: true,
  suppressRowClickSelection: true // Suppress so that a row is only selectable by checking the checkbox
};
