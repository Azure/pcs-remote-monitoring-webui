// Copyright (c) Microsoft. All rights reserved.

import moment from 'moment';
import { SeverityRenderer, RuleStatusRenderer } from 'components/shared/cellRenderers';
import { DEFAULT_TIME_FORMAT, gridValueFormatters } from 'components/shared/pcsGrid/pcsGridConfig';

export const LAST_TRIGGER_DEFAULT_WIDTH = 310;

export const checkboxParams = {
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true
};

const { checkForEmpty } = gridValueFormatters;

export const rulesColumnDefs = {
  ruleName: {
    headerName: 'Rule Name',
    field: 'name',
    filter: 'text'
  },
  description: {
    headerName: 'Description',
    field: 'description',
    filter: 'text'
  },
  severity: {
    headerName: 'Severity',
    field: 'severity',
    filter: 'text',
    cellRendererFramework: SeverityRenderer
  },
  filter: {
    headerName: 'Filter',
    field: 'groupId',
    filter: 'text',
    // cellRendererFramework: DeviceSourceCellRenderer
  },
  trigger: {
    headerName: 'Trigger',
    field: 'conditions',
    filter: 'text',
    valueFormatter: ({ value }) => {
      if (Array.isArray(value) && value.length) {
        return value.map(trigger => trigger['field'] || 'Unknown').join(' and ');
      }
      return 'Unknown'
    }
  },
  notificationType: {
    headerName: 'Notification Type',
    field: 'type',
    filter: 'text',
    valueFormatter: ({ value }) => value || 'Maintenance log'
  },
  status: {
    headerName: 'Status',
    field: 'enabled',
    filter: 'text',
    cellRendererFramework: RuleStatusRenderer
  },
  count: {
    headerName: 'Count',
    field: 'count',
    valueFormatter: ({ value }) => value || 'loading...'
    // cellRendererFramework: deviceCountCellRenderer,
  },
  lastTrigger: {
    headerName: 'Last Trigger',
    field: 'lastTrigger',
    valueFormatter: ({ value }) => {
      if (value) {
        const time = moment(value);
        return checkForEmpty((time.unix() > 0) ? time.format(DEFAULT_TIME_FORMAT) : '');
      }
      return 'Loading...'
    },
    // cellRendererFramework: LastTriggerCellRenderer,
    width: LAST_TRIGGER_DEFAULT_WIDTH
  }
};

export const defaultRulesGridProps = {
  enableColResize: true,
  multiSelect: true,
  paginationPageSize: 20,
  rowSelection: 'multiple',
  suppressCellSelection: true,
  suppressClickEdit: true,
  suppressRowClickSelection: true
};
