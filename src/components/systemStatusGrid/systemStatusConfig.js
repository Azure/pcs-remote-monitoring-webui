// Copyright (c) Microsoft. All rights reserved.

import moment from 'moment';
import lang from '../../common/lang';

export const EMPTY_FIELD = '---';
export const DEFAULT_SYSTEM_GRID_PAGE_SIZE = 6;

/** A collection of reusable value formatter methods */
export const gridValueFormatters = {
  checkForEmpty: value => value || 0
};

/** A collection of column definitions for the systemStatusGrid */
export const systemStatusColumnDefs = {
  jobId: {
    headerName: lang.JOBNAME,
    field: 'jobId'
  },
  deviceIdEffected: {
    headerName: lang.DEVICE_ID_EFFECTED,
    field: 'deviceId'
  },
  status: {
    headerName: lang.STATUS,
    field: 'status',
    valueFormatter: ({ value }) => {
      switch (value) {
        case 1: return lang.ENQUEUED;
        case 2: return lang.RUNNING;
        case 3: return lang.COMPLETED;
        case 4: return lang.FAILED;
        case 5: return lang.CANCELLED;
        case 6: return lang.SCHEDULED;
        default: return lang.QUEUED;
      }
    }
  },
  lastReturnMessage: {
    headerName: lang.LAST_RETURN_MESSAGE,
    field: 'type',
    valueFormatter: ({ value, data }) => {
      if (value === 3 && Object.keys(data.methodParameter.name).length) {
        return data.methodName +  lang.NOT_COMPLETED;
      } else {
        return data.methodName + lang.COMPLETED;
      }
    }
  },
  type: {
    headerName: lang.OPERATION,
    field: 'type',
    valueFormatter: ({ value, data }) => {
      if (value === 3) {
        return data.methodParameter && data.methodParameter.name;
      } else if (value === 4) {
        if (data.updateTwin && data.updateTwin.tags && Object.keys(data.updateTwin.tags).length) {
          return lang.TAG;
        } else {
          return lang.RECONFIGURE;
        }
      }
      return '';
    }
  },
  deviceCount: {
    headerName: lang.NO_OF_DEVICES,
    field: 'resultStatistics.deviceCount',
    valueFormatter: ({ value }) => gridValueFormatters.checkForEmpty(value)
  },
  succeededCount: {
    headerName: lang.SUCCEEDED_CAPITAL,
    field: 'resultStatistics.succeededCount',
    valueFormatter: ({ value }) => gridValueFormatters.checkForEmpty(value)
  },
  failedCount: {
    headerName: lang.FAILED_CAPITAL,
    field: 'resultStatistics.failedCount',
    valueFormatter: ({ value }) => gridValueFormatters.checkForEmpty(value)
  },
  startTime: {
    headerName: lang.START_TIME,
    field: 'createdTimeUtc',
    valueFormatter: ({ value }) => {
      const time = moment(value);
      return time.unix() < 0 ? EMPTY_FIELD : time.format('hh:mm:ss MM.DD.YYYY');
    }
  },
  endTime: {
    // TODO: Replace when service provides the endTime
    headerName: lang.END_TIME,
    field: 'endTimeUtc',
    valueFormatter: ({ value }) =>  EMPTY_FIELD
  }
};


export const getSoftSelectId = ({ jobId }) => jobId;

/** Shared device grid AgGrid properties */
export const systemStatusGridProps = {
  multiSelect: true,
  rowSelection: 'multiple',
  enableColResize: true,
  pagination: true,
  domLayout: 'autoHeight',
  paginationPageSize: DEFAULT_SYSTEM_GRID_PAGE_SIZE,
  suppressCellSelection: true,
  suppressRowClickSelection: true, // Suppress so that a row is only selectable by checking the checkbox
  suppressClickEdit: true
};
