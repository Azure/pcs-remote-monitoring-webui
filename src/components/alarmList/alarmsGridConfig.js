// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import lang from '../../common/lang';
import SeverityCellRenderer from '../cellRenderers/severityCellRenderer/severityCellRenderer';
import ElipsisCellRenderer from '../cellRenderers/elipsisCellRenderer/elipsisCellRenderer';
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
    field: 'ruleId',
    tooltipField: "ruleId",
    headerTooltip: lang.RULENAME
  },
  severity: {
    headerName: lang.SEVERITY,
    field: 'severity',
    tooltipField: "severity",
    headerTooltip: lang.SEVERITY,
    cellRendererFramework: SeverityCellRenderer
  },
  created: {
    headerName: lang.CREATED,
    field: 'created',
    tooltipField: "created",
    headerTooltip: lang.CREATED
  },
  firmware: {
    headerName: lang.FIRMWARE,
    field: 'Properties.Reported.Firmware',
    tooltipField: "Properties.Reported.Firmware",
    headerTooltip: lang.FIRMWARE,
  },
  occurrences: {
    headerName: lang.OPENOCCURRENCES,
    field: 'occurrences',
    tooltipField: "occurrences",
    headerTooltip: lang.OPENOCCURRENCES,
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  explore: {
    headerName: lang.EXPLOREALARM,
    field: 'Connected',
    tooltipField: "Connected",
    headerTooltip: lang.EXPLOREALARM,
    cellRendererFramework: () => <ElipsisCellRenderer to={'/maintenance'}/>
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
