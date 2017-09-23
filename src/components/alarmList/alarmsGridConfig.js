// Copyright (c) Microsoft. All rights reserved.

import lang from '../../common/lang';
import SeverityCellRenderer from '../cellRenderers/severityCellRenderer/severityCellRenderer';
import { gridValueFormatters } from '../pcsGrid/pcsGridConfig';

const { checkForEmpty } = gridValueFormatters;

export const DEFAULT_ALARM_GRID_PAGE_SIZE = 8;

export const checkboxParams = {
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true
};

/** A collection of column definitions for the alarms grid */
export const alarmColumnDefs = {
  name: {
    headerName: lang.RULENAME,
    field: 'ruleId'
  },
  severity: {
    headerName: lang.SEVERITY,
    field: 'severity',
    cellRendererFramework: SeverityCellRenderer
  },
  created: {
    headerName: lang.CREATED,
    field: 'created',
  },
  firmware: {
    headerName: lang.FIRMWARE,
    field: 'Properties.Reported.Firmware',

  },
  occurrences: {
    headerName: lang.OPENOCCURRENCES,
    field: 'occurrences',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  explore: {
    headerName: lang.EXPLOREALARM,
    field: 'Connected',
    valueGetter: params => '...'
  }
};

/** Given a device object, extract and return the alarm Id */
export const getSoftSelectId = ({ Id }) => Id;

/** Shared device grid AgGrid properties */
export const defaultAlarmGridProps = {
  enableColResize: true,
  multiSelect: true,
  pagination: true,
  paginationPageSize: DEFAULT_ALARM_GRID_PAGE_SIZE,
  rowSelection: 'multiple'
};
