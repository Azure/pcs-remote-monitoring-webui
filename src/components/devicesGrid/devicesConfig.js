// Copyright (c) Microsoft. All rights reserved.

import moment from 'moment';
import lang from '../../common/lang';

export const EMPTY_FIELD = '---';
export const DEFAULT_DEVICE_GRID_PAGE_SIZE = 50;

/** A collection of reusable value formatter methods */
export const gridValueFormatters = {
    checkForEmpty: value => value || EMPTY_FIELD
};

/** A collection of column definitions for the devices grid */
export const deviceColumnDefs = {
    id: { 
        headerName: lang.DEVICES.DEVICENAME, 
        field: 'Id', 
        headerCheckboxSelection: true, 
        headerCheckboxSelectionFilteredOnly: true, 
        checkboxSelection: true
    },
    isSimulated: { 
        headerName: lang.DEVICE_DETAIL.SIMULATED, 
        field: 'IsSimulated', 
        valueFormatter: ({ value }) => value ? lang.DEVICES.YES: lang.DEVICES.NO
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
        valueFormatter: ({ value }) => Object.keys(value || {}).join('; ') || EMPTY_FIELD
    },
    status: { 
        headerName: lang.DEVICE_DETAIL.STATUS, 
        field: 'Connected', 
        valueFormatter: ({ value }) => value ? lang.DEVICES.CONNECTED : lang.DEVICES.DISCONNECTED
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
export const deviceGridProps = {
    multiSelect: true,
    rowSelection: 'multiple',
    enableColResize: true,
    pagination: true,
    paginationPageSize: DEFAULT_DEVICE_GRID_PAGE_SIZE,
    suppressCellSelection: true,
    suppressRowClickSelection: true, // Suppress so that a row is only selectable by checking the checkbox
    suppressClickEdit: true
};
