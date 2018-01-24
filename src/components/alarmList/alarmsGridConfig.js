// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import lang from '../../common/lang';
import Config from '../../common/config';
import severityCellRenderer from '../cellRenderers/severityCellRenderer/severityCellRenderer';
import ElipsisCellRenderer from '../cellRenderers/elipsisCellRenderer/elipsisCellRenderer';
import { gridValueFormatters } from '../pcsGrid/pcsGridConfig';

const { checkForEmpty } = gridValueFormatters;

export const checkboxParams = {
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true
};

/** A collection of column definitions for the alarms grid */
export const alarmColumnDefs = {
  name: {
    headerName: lang.RULENAME,
    field: 'ruleName',
    tooltipField: "ruleName",
    headerTooltip: lang.RULENAME,
    width: 800
  },
  severity: {
    headerName: lang.SEVERITY,
    field: 'severity',
    hideSeverityValue: true,
    tooltipField: "severity",
    cellStyle: {'padding-top': '15px', 'padding-left':'25px'},
    headerTooltip: lang.SEVERITY,
    width: 300,
    cellRendererFramework: severityCellRenderer
  },
  firmware: {
    headerName: lang.FIRMWARE,
    field: 'Properties.Reported.Firmware',
    tooltipField: "Properties.Reported.Firmware",
    headerTooltip: lang.FIRMWARE,
  },
  occurrences: {
    headerName: lang.OPEN,
    field: 'occurrences',
    tooltipField: "occurrences",
    cellStyle: {'padding-left':'15px'},
    width: 300,
    headerTooltip: lang.OPENOCCURRENCES,
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  explore: {
    headerName: lang.EXPLORE,
    field: 'Connected',
    tooltipField: "Connected",
    headerTooltip: lang.EXPLOREALARM,
    width: 300,
    cellRendererFramework: ({ data }) => <ElipsisCellRenderer to={`/maintenance/rule/${data.ruleId}`} />
  }
};

/** Given a device object, extract and return the alarm Id */
export const getSoftSelectId = ({ Id }) => Id;

/** Shared device grid AgGrid properties */
export const defaultAlarmGridProps = {
  enableColResize: true,
  multiSelect: true,
  paginationPageSize: Config.ALARMGRID_ROWS,
  rowSelection: 'multiple'
};
