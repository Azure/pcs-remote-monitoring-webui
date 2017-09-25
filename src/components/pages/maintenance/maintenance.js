// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Select from 'react-select';
import * as _ from 'lodash';

import { systemStatusColumnDefs } from '../../systemStatusGrid/systemStatusConfig';
import PageContainer from '../../layout/pageContainer/pageContainer.js';
import PageContent from '../../layout/pageContent/pageContent.js';
import TopNav from '../../layout/topNav/topNav.js';
import ContextFilters from '../../layout/contextFilters/contextFilters.js';
import * as actions from "../../../actions";
import lang from '../../../common/lang';
import ManageFilterBtn from '../../shared/contextBtns/manageFiltersBtn';
import PcsBtn from '../../shared/pcsBtn/pcsBtn';
import ApiService from '../../../common/apiService';
import AddSvg from '../../../assets/icons/Add.svg';
import DeleteSvg from '../../../assets/icons/Delete.svg';
import EditSvg from '../../../assets/icons/Edit.svg';
import EnableSvg from '../../../assets/icons/Enable.svg';
import DisableSvg from '../../../assets/icons/Disable.svg';
import ChangestatusSvg from '../../../assets/icons/Change_status.svg';
import CloseAlarmSvg from '../../../assets/icons/CloseAlarm.svg';
import AckAlarmSvg from '../../../assets/icons/AcknowledgeAlarm.svg';

import './maintenance.css';

class MaintenancePage extends Component {
  constructor(props) {
    super(props);
    this.systemStatusColumnDefsLocal = _.cloneDeep(systemStatusColumnDefs);
    this.systemStatusColumnDefsArray = [
      this.systemStatusColumnDefsLocal.jobId,
      this.systemStatusColumnDefsLocal.deviceIdAffected, // DeviceId in each job affected
      this.systemStatusColumnDefsLocal.status, // Status of jobs ( fail/ Queued/completed)
      this.systemStatusColumnDefsLocal.lastReturnMessage, // Last mesaage about completeion of jobs
      this.systemStatusColumnDefsLocal.startTime, // StartTime of the job
      this.systemStatusColumnDefsLocal.endTime //End time of the job
    ];
    this.state = {
      systemStatusDetailsDevices: [],
      systemStatusDetailsJobs: [],
      selectedDetailsDevices: [],
      selectedGrid: 'alarms',
      timerange: 'PT1H',
      lastRefreshed: new Date(),
      rulesAndActions: [],
      selectedRulesActions: [],
      selectedAlarms: [],
      currentNode: null,
      showBoth: false,
      toggleButtonText: lang.DISABLE,
      toggleButtonSvg: ChangestatusSvg,
      softSelectId: '',
      softSelectedDeviceId: '',
      contextBtns: ''
    }

    this.contextButtons = {
      newRule: {
        svg: AddSvg,
        onClick: this.newRule,
        value: lang.NEWRULE
      },
      delete: {
        svg: DeleteSvg,
        onClick: this.showDeleteRulesModal,
        value: lang.DELETE
      },
      edit: {
        svg: EditSvg,
        onClick: this.showEditRulesFlyout,
        value: lang.EDIT
      },
      close: {
        svg: CloseAlarmSvg,
        onClick: () => this.updateAlarm('closed'),
        value: lang.CLOSE
      },
      acknowledge: {
        svg: AckAlarmSvg,
        onClick: () => this.updateAlarm('acknowledged'),
        value: lang.ACKNOWLEDGE
      }
    };
    this.onDeviceJobSoftSelectChange = this.onDeviceJobSoftSelectChange.bind(this);
    this.onTimeRangeChange = this.onTimeRangeChange.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadMaintenanceData({
      from: `NOW-${this.state.timerange}`,
      to: 'NOW'
    });
  }

  onTimeRangeChange(selectedOption) {
    if (!selectedOption) return;
    this.setState({
      timerange: selectedOption.value,
      lastRefreshed: new Date()
    }, () => this.props.actions.loadMaintenanceData({
      from: `NOW-${this.state.timerange}`,
      to: 'NOW'
    }));
  }

  updateAlarm = (Status) => {
    const { selectedAlarms } = this.state;
    Promise.all(
      selectedAlarms.map(alarm => ApiService.updateAlarmsStatus({...alarm, Status}))
    ).then(dataArray => {
      console.log('succ', dataArray)
      // TODO: update UI with succ data
    });
  }

// --- Grid events handler starts here ----------------------------------

  onContextMenuChange = contextBtns => this.setState({ contextBtns });

  onSoftSelectDeviceGrid = device => {
    this.setState(
      { softSelectedDeviceId: this.getSoftSelectId(device) },
      () => this.props.actions.showFlyout({ device, type: 'Device detail' })
    );
  }

  onRuleDetailSoftSelectionChange = (rowData, row) => {
    const { actions } = this.props;
    actions.hideFlyout();
    this.setState(
      { softSelectId: this.getSoftSelectId(rowData) },
      () => {
        const flyoutConfig = {
          onUpdateData: this.onUpdateData,
          title: lang.RULEDETAIL,
          type: 'New Rule',
          rule: rowData
        };
        actions.showFlyout(flyoutConfig);
        this.setState({ currentNode: row.node });
      }
    );
  };

  showToggleRules = () => {
    const { actions } = this.props;
    const flyoutConfig = {
      onUpdateData: this.onUpdateData,
      selectedRules: this.state.selectedRulesActions,
      type: 'Rule Detail'
    };
    actions.showFlyout(flyoutConfig);
  };

  newRule = () => {
    this.gridApi.deselectAll();
    const flyoutConfig = {
      onUpdateData: this.onUpdateData,
      title: lang.NEWRULE,
      type: 'New Rule'
    };
    this.props.actions.showFlyout(flyoutConfig);
    this.setState({ currentNode: null });
  };

  onRuleDetailHardSelectChange = selectedRulesActions => {
    let status;

    // All selected rows have same status field?
    let showBoth = !selectedRulesActions.every(row => {
      if (status === undefined) {
        status = row.Enabled
      } else if (status !== row.Enabled) {
        return false
      }
      return true;
    });

    const { actions } = this.props;
    actions.rulesSelectionChanged(selectedRulesActions);

    this.setState({
      selectedRulesActions,
      selectedAlarms: [],
      showBoth: showBoth,
      toggleButtonText: showBoth ? lang.CHANGESTATUS : status ? lang.DISABLE : lang.ENABLE,
      toggleButtonSvg: showBoth ? ChangestatusSvg : status ? DisableSvg : EnableSvg,
    });
  };

  onAlarmOccGridHardSelectChange = selectedAlarms => {
    this.setState({
      selectedAlarms,
      selectedRulesActions: []
    });
  };

  getSoftSelectId = ({ Id }) => Id;

  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
  }

  componentWillMount() {
    this.selectJobAndSetState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.selectJobAndSetState(nextProps);
  }



  // Retrieving the deviceIds from "queryCondition": "deviceId in ['Simulated.prototype-01.0','Simulated.prototype-01.1']".
  selectJobAndSetState(props) {
    const { jobs } = props;
    if (!props.params || !props.params.jobId) {
      return;
    }
    if (!jobs || !jobs.length) { return; }
    const job = _.find(jobs, { jobId: props.params.jobId });
    let deviceJobs = [];
    if (job.queryCondition) {
      const idx = job.queryCondition.indexOf('in [');
      if (idx !== -1) {
        const idx2 = job.queryCondition.indexOf(']', idx);
        if (idx2 !== -1) {
          const deviceIdsInQuery = job.queryCondition.substring(idx + 4, idx2);
          const deviceIds = deviceIdsInQuery.replace(/["']{1}/gi, '').split(',');
          deviceJobs = deviceIds.map(deviceId => ({
            jobId: job.jobId,
            deviceId,
            methodName : job.methodParameter.name,
            status : job.status,
            failedCount: job.resultStatistics.failedCount,
            succeededCount: job.resultStatistics.succeededCount,
            type: job.type
          }));
          // If the grid is related to tags or reconfigure then hide endtime and lastReturnMessage
          this.systemStatusColumnDefsLocal.endTime.hide = job.type === 4;
          this.systemStatusColumnDefsLocal.lastReturnMessage.hide = job.type === 4;
        }
      }
    }
    this.setState({ systemStatusDetailsDevices: deviceJobs, systemStatusDetailsJobs: [job] });
  }

  onDeviceJobSoftSelectChange({deviceId}) {
    const selectedDeviceIdInJob = deviceId;
    let deviceJob;
    if (!this.props.devices || !this.props.devices.items) { return false; }
    this.props.devices.items.some(device => {
      if (device.Id === selectedDeviceIdInJob) {
        deviceJob = device;
        return true;
      }
      return false;
    });
    this.setState({ selectedDetailsDevices: [deviceJob] });
  }

  showEditRulesFlyout = () => {
    const { actions } = this.props;
    actions.hideFlyout();
    const flyoutConfig = {
      onUpdateData: this.onUpdateData,
      title: lang.RULEDETAIL,
      type: 'New Rule',
      rule: this.state.selectedRulesActions[0],
      inEdit: true
    };
    actions.showFlyout(flyoutConfig);
    this.setState({ currentNode: this.state.selectedRulesActions[0].node });
  };

  getGridActions = () => {
    return {
      showToggleRules: this.showToggleRules,
      newRule: this.newRule,
      onRuleDetailHardSelectChange: this.onRuleDetailHardSelectChange,
      onRuleDetailSoftSelectionChange: this.onRuleDetailSoftSelectionChange,
      onAlarmOccGridHardSelectChange: this.onAlarmOccGridHardSelectChange,
      onAlarmOccGridSoftSelectionChange: this.onAlarmOccGridSoftSelectionChange,
      onSoftSelectDeviceGrid: this.onSoftSelectDeviceGrid,
      getSoftSelectId: this.getSoftSelectId,
      onGridReady: this.onGridReady,
      onContextMenuChange: this.onContextMenuChange
    };
  };

// --- Grid events handler ends here ----------------------------------
  render() {
    const pcsBtn = (props, visible = true) => visible ? <PcsBtn {...props} /> : '';
    const showContextBtns = this.state.contextBtns === '';
    const showActionBtns = this.state.selectedRulesActions.length > 0;
    const devicesList = this.props.devices && this.props.devices.items ? this.props.devices.items : [];
    const alarmListProps = {
      alarms: this.props.alarmList,
      devices: devicesList,
      detailsJobs: this.state.systemStatusDetailsJobs,
      detailsDevices: this.state.systemStatusDetailsDevices,
      systemStatusGridSelectedDevices: this.state.selectedDetailsDevices,
      onDeviceJobSoftSelectChange : this.onDeviceJobSoftSelectChange,
      systemStatusGridColumnDefs: this.systemStatusColumnDefsArray,
      alarmsGridData: this.props.alarmsGridData,
      actions: this.props.actions,
      jobs: this.props.jobs,
      btnActions: this.getGridActions() //TODO: add all grid related actions
    };
    return (
      <PageContainer>
        <TopNav breadcrumbs={lang.MAINTENANCE} projectName={lang.AZUREPROJECTNAME} />
        <ContextFilters>
          {pcsBtn({ // Change status button
            svg: this.state.toggleButtonSvg,
            onClick: this.showToggleRules,
            value: this.state.toggleButtonText
          }, showActionBtns && showContextBtns)}
          {pcsBtn(this.contextButtons.edit, this.state.selectedRulesActions.length === 1 && showContextBtns)}
          {pcsBtn(this.contextButtons.close, this.state.selectedAlarms.length > 0 && showContextBtns)}
          {pcsBtn(this.contextButtons.acknowledge, this.state.selectedAlarms.length > 0 && showContextBtns)}
          {this.state.contextBtns}
          <ManageFilterBtn />
        </ContextFilters>
        <PageContent>
          <div className="timerange-selection">
            <Select
              value={this.state.timerange}
              onChange={this.onTimeRangeChange}
              searchable={false}
              clearable={false}
              options={[
                {
                  value: 'PT1H',
                  label: lang.LASTHOUR
                },
                {
                  value: 'P1D',
                  label: lang.LASTDAY
                },
                {
                  value: 'P1W',
                  label: lang.LASTWEEK
                },
                {
                  value: 'P1M',
                  label: lang.LASTMONTH
                }
              ]}
            />
            <span className="last-refreshed-text"> {`${lang.LAST_REFRESHED} | `} </span>
            <div className="last-refreshed-time">{this.state.lastRefreshed.toLocaleString()}</div>
            <div className="refresh-icon icon-sm" />
          </div>
          {React.cloneElement(this.props.children, {...alarmListProps})}
        </PageContent>
      </PageContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    alarmList: state.deviceReducer.alarmsList,
    devices: state.deviceReducer.devices,
    alarmsGridData: state.maintenanceReducer.alarmsByRuleGridRowData,
    jobs: state.systemStatusJobReducer.jobs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MaintenancePage);
