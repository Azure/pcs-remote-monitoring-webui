import SeverityCellRenderer from "./severityCellRenderer";
import StatusCellRenderer from "./statusCellRenderer";
import deviceCountCellRenderer from "./deviceCountCellRenderer";
import LastTriggerCellRenderer from "./lastTriggerCellRenderer";
import DeviceSourceCellRenderer from "./deviceSourceCellRenderer";
import lang from "../../common/lang";

export const LastTriggerDefaultWidth = 310;

export const checkboxParams = {
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true
};

export const rulesAndActionsColumnDefs = {
  ruleName: {
    headerName: lang.RULESACTIONS.RULENAME,
    field: 'Name',
    filter: 'text'
  },
  description: {
    headerName: lang.RULESACTIONS.DESCRIPTION,
    field: 'Description',
    filter: 'text'
  },
  severity: {
    headerName: lang.RULESACTIONS.SEVERITY,
    field: 'Severity',
    filter: 'text',
    cellRendererFramework: SeverityCellRenderer
  },
  filter: {
    headerName: lang.RULESACTIONS.FILTER,
    field: 'GroupId',
    filter: 'text',
    cellRendererFramework: DeviceSourceCellRenderer
  },
  trigger: {
    headerName: lang.RULESACTIONS.TRIGGER,
    field: 'Conditions',
    filter: 'text',
    valueFormatter: ({ value }) => {
      if (Array.isArray(value) && value.length) {
        return value.map(trigger => trigger['Field'] || 'Unknown').join(' and ');
      }
      return 'Unknown'
    }
  },
  notificationType: {
    headerName: lang.RULESACTIONS.NOTIFICATIONTYPE,
    field: 'Action.Type',
    filter: 'text',
    valueFormatter: ({ value }) => value || lang.RULESACTIONS.ALARMLOG
  },
  status: {
    headerName: lang.RULESACTIONS.STATUS,
    field: 'Enabled',
    filter: 'text',
    cellRendererFramework: StatusCellRenderer
  },
  count: {
    headerName: lang.RULESACTIONS.COUNT,
    cellRendererFramework: deviceCountCellRenderer,
  },
  lastTrigger: {
    headerName: lang.RULESACTIONS.LASTTRIGGER,
    cellRendererFramework: LastTriggerCellRenderer,
    width: LastTriggerDefaultWidth
  }
};

export const defaultRulesAndActionsGridProps = {
  domLayout: 'autoHeight',
  rowSelection: 'multiple',
  enableColResize: true,
  suppressCellSelection: true,
  suppressClickEdit: true,
  suppressRowClickSelection: true,
  pagination: true,
  paginationPageSize: 50
};