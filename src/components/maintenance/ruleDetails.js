// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import PcsGrid from '../pcsGrid/pcsGrid';
import DevicesGrid from '../devicesGrid/devicesGrid';
import RulesActionsList from '../rulesActionsList/rulesActionsList';
import TelemetryWidget from '../telemetryWidget/telemetryWidget';
import lang from '../../common/lang';
import SeverityCellRenderer from '../cellRenderers/severityCellRenderer/severityCellRenderer';

import './ruleDetails.css';

const alarmsColumnDefs = [
  {
    headerName: lang.OCCURRENCE,
    field: 'rule_name',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true
  },
  { headerName: lang.DESCRIPTION, field: 'description' },
  {
    headerName: lang.SEVERITY,
    field: 'severity',
    cellRendererFramework: SeverityCellRenderer
  },
  { headerName: lang.TRIGGER_DEVICE, field: 'trigger_device' },
  { headerName: lang.TIME, field: 'time' },
  { headerName: lang.STATUS, field: 'status' }
];

const aggregatedRuleColumnDefs = [
  { headerName: lang.TOTAL, field: 'total_occrrences' },
  { headerName: lang.OPEN, field: 'open_occrrences' },
  { headerName: lang.ACKNOWLEDGED, field: 'ack_occrrences' },
  { headerName: lang.CLOSED, field: 'close_occrrences' },
  { headerName: lang.LAST_EVENT, field: 'last_occrrences' },
  { headerName: lang.SEVERITY, field: 'severity' }
];

const timeline = {
  selectedTelemetry: '',
  chartConfig: {
    bindto: '#maintenance_chart',
    data: {
      json: [],
      xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
      keys: {
        x: 'Time',
        value: []
      }
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%H:%M:%S'
        }
      }
    },
    tooltip: {
      format: {
        title: d => d
      }
    },
    zoom: {
      enabled: true
    },
    line: {
      connectNull: true
    }
  },
  chartId: 'maintenance_chart'
};

const Section = ({ header, children, className, childClassName }) => <div className={className ? className : "section-container"}>
  <div className="section-container">{header}</div>
  <div className={childClassName}>{children}</div>
</div>;

class RuleDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeline,
      alarmsColumnDefs,
      timerange: 'PT1H',
      rowData: undefined,
      loading: true,
      deviceIdList: '',
      ruleId: '',
      selectedAll: true,
      selectedDevices: false,
      selectedTelemetry: false
    };

    this.selectGrid = this.selectGrid.bind(this);
  }

  componentDidMount() {
    const ruleId = (this.props.params || {}).id;
    const ruleDetails = (this.props.alarmsGridData || []).filter(data => data.id === ruleId)[0];
    if (!ruleId || !ruleDetails) return;
    const alarmsByRule = ruleDetails[ruleId];
    const devicesList = this.getDeviceList(alarmsByRule);
    const devicesGridData = this.props.devices.filter(device => devicesList.has(device.Id));
    this.setState({
      ruleId,
      devicesGridData,
      deviceIdList: devicesGridData.map(({ Id }) => Id).join(','),
      rowData: alarmsByRule.map(item => {
        return {
          id: item.Id,
          rule_name: ruleDetails.name,
          description: item.Description,
          severity: item.Rule.Severity,
          trigger_device: item.DeviceId,
          time: item.DateCreated,
          status: item.Status
        };
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    const { params, devices, alarmsGridData } = nextProps;
    const ruleId = (params || {}).id;
    const ruleDetails = (alarmsGridData || []).filter(data => data.id === ruleId)[0];
    if (!ruleId || !ruleDetails) return;
    const alarmsByRule = ruleDetails[ruleId];
    const devicesList = this.getDeviceList(alarmsByRule);
    const devicesGridData = devices.filter(device => devicesList.has(device.Id));
    this.setState({
      ruleId,
      devicesGridData,
      deviceIdList: devicesGridData.map(({ Id }) => Id).join(','),
      rowData: alarmsByRule.map(item => {
        return {
          id: item.Id,
          rule_name: ruleDetails.name,
          description: item.Description,
          severity: item.Rule.Severity,
          trigger_device: item.DeviceId,
          time: item.DateCreated,
          status: item.Status
        };
      })
    });
  }

  getDeviceList(alarms) {
    return new Set(alarms.map(({ DeviceId }) => DeviceId));
  }

  selectGrid(event) {
    this.setState({
      selectedAll: event.currentTarget.textContent === lang.ALL,
      selectedDevices: event.currentTarget.textContent === lang.DEVICES,
      selectedTelemetry: event.currentTarget.textContent === lang.TELEMETRY
    });
  }

  render() {
    const ruleId = (this.props.params || {}).id;
    const ruleDetails = (this.props.alarmsGridData || []).filter(({ id }) => id === ruleId)[0];
    const aggregatedRule = ruleDetails ? aggregatedRuleColumnDefs.map((col, idx) => (<div className="aggregated-rule-column" key={idx}>
      <div className="aggregated-rule-details-header">{col.headerName}</div>
      <div className="aggregated-rule-details-field">{ruleDetails[col.field]}</div>
    </div>)) : null;
    const { btnActions } = this.props;

    const rulesAndActionsProps = {
      rowData: (ruleDetails || {}).rule ? [ruleDetails.rule] : undefined,
      pagination: false,
      softSelectId: this.state.softSelectId,
      getSoftSelectId: btnActions.getSoftSelectId,
      onGridReady: btnActions.onRuleGridReady,
      onHardSelectChange: btnActions.onRuleDetailHardSelectChange,
      onSoftSelectChange: btnActions.onRuleDetailSoftSelectionChange,
      onContextMenuChange: btnActions.onContextMenuChange
    };

    const deviceGridProps = {
      /* Grid Properties */
      //TODO: finish all the event handlers
      rowData: this.state.devicesGridData,
      domLayout: 'autoHeight',
      softSelectId: this.state.softSelectedDeviceId,
      getSoftSelectId: btnActions.getSoftSelectId,
      /* Grid Events */
      onGridReady: btnActions.onDeviceGridReady,
      onSoftSelectChange: btnActions.onSoftSelectDeviceGrid,
      onHardSelectChange: btnActions.onDeviceGridHardSelectChange,
      onContextMenuChange: btnActions.onContextMenuChange
    };

    const telemetryProps = {
      timeline,
      queryParams: {
        order: 'desc',
        from: `NOW-${this.state.timerange}`,
        to: 'NOW',
        devices: this.state.deviceIdList
      }
    };
    return (
      <div className="rule-details-container">
        <div className="aggregated-rule">
          <div className="aggregated-rule-name">{(ruleDetails || {}).name}</div>
          <div className="aggregated-rule-details">{aggregatedRule}</div>
        </div>
        <div className="rule-subtitle">{lang.RULE_SUBTITLE}</div>

        <Section header={lang.RULE_DETAIL} childClassName="rule-details">
          <RulesActionsList {...rulesAndActionsProps} />
        </Section>

        <Section header={lang.ALARM_OCCURENCE} childClassName="alarm-occurences">
          <PcsGrid
            columnDefs={alarmsColumnDefs}
            paginationAutoPageSize={true}
            suppressScrollOnNewData={true}
            pagination={true}
            paginationPageSize={8}
            rowData={this.state.rowData}
            enableSorting={false}
            enableSearch={false}
            enableFilter={false}
            multiSelect={true}
            rowSelection={'multiple'}
            showLastUpdate={false}
            enableColResize={true}
            suppressMovableColumns={true}
            softSelectId={this.state.softSelectedDeviceId}
            /* Grid Events */
            onGridReady={btnActions.onAlarmGridReady}
            onHardSelectChange={btnActions.onAlarmOccGridHardSelectChange}
            onSoftSelectChange={btnActions.onAlarmOccGridSoftSelectionChange}
            getSoftSelectId={this.getSoftSelectId}
            onContextMenuChange={btnActions.onContextMenuChange}
          />
        </Section>

        <Section header={lang.RELATED_INFO} childClassName="selection-bar">
          <div className={this.state.selectedAll ? 'selection-item-active' : 'selection-item'} onClick={this.selectGrid}>{lang.ALL}</div>
          <div className={this.state.selectedDevices ? 'selection-item-active' : 'selection-item'} onClick={this.selectGrid}>{lang.DEVICES}</div>
          <div className={this.state.selectedTelemetry ? 'selection-item-active' : 'selection-item'} onClick={this.selectGrid}>{lang.TELEMETRY}</div>
        </Section>

        <Section
          header={lang.ALARMED_DEVICE}
          childClassName="device-grid"
          className={(this.state.selectedAll || this.state.selectedDevices) ? '' : 'hide-content'}>
          <DevicesGrid { ...deviceGridProps } />
        </Section>

        <Section header={lang.ALARMED_TELEMETRY} className={(this.state.selectedAll || this.state.selectedTelemetry) ? '' : 'hide-content'}>
          <TelemetryWidget {...telemetryProps} />
        </Section>
      </div>
    );
  }
}

export default RuleDetailsPage;
