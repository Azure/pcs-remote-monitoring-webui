// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Select from 'react-select';

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

    this.state = {
      selectedGrid: 'alarms',
      timerange: 'PT1H',
      lastRefresed: new Date(),
      rulesAndActions: [],
      selectedRulesActions: [],
      selectedAlarms: [],
      currentNode: null,
      showBoth: false,
      toggleButtonText: lang.RULESACTIONS.DISABLE,
      toggleButtonSvg: ChangestatusSvg,
      softSelectId: ''
    }

    this.contextButtons = {
      newRule: {
        svg: AddSvg,
        onClick: this.newRule,
        value: lang.RULESACTIONS.NEWRULE
      },
      delete: {
        svg: DeleteSvg,
        onClick: this.showDeleteRulesModal,
        value: lang.RULESACTIONS.DELETE
      },
      edit: {
        svg: EditSvg,
        onClick: this.showEditRulesFlyout,
        value: lang.RULESACTIONS.EDIT
      },
      close: {
        svg: CloseAlarmSvg,
        onClick: () => this.updateAlarm('close'),
        value: lang.CLOSE
      },
      acknowledge: {
        svg: AckAlarmSvg,
        onClick: () => this.updateAlarm('acknowledge'),
        value: lang.ACKNOWLEDGE
      }
    };

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
      lastRefresed: new Date()
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

  onRuleDetailSoftSelectionChange = (rowData, row) => {
    const { actions } = this.props;
    actions.hideFlyout();
    this.setState(
      { softSelectId: this.getSoftSelectId(rowData) },
      () => {
        const flyoutConfig = {
          onUpdateData: this.onUpdateData,
          title: lang.RULESACTIONS.RULEDETAIL,
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
      title: lang.RULESACTIONS.NEWRULE,
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
      toggleButtonText: showBoth ? lang.RULESACTIONS.CHANGESTATUS : status ? lang.RULESACTIONS.DISABLE : lang.RULESACTIONS.ENABLE,
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

  showEditRulesFlyout = () => {
    const { actions } = this.props;
    actions.hideFlyout();
    const flyoutConfig = {
      onUpdateData: this.onUpdateData,
      title: lang.RULESACTIONS.RULEDETAIL,
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
      getSoftSelectId: this.getSoftSelectId,
      onGridReady: this.onGridReady,
    };
  };

// --- Grid events handler ends here ----------------------------------
  render() {
    const pcsBtn = (props, visible = true) => visible ? <PcsBtn {...props} /> : '';
    const showActionBtns = this.state.selectedRulesActions.length > 0;
    const devicesList = this.props.devices && this.props.devices.items ? this.props.devices.items : [];
    const alarmListProps = {
      alarms: this.props.alarmList,
      devices: devicesList,
      alarmsGridData: this.props.alarmsGridData,
      actions: this.props.actions,
      jobs:{}, // TODO (ss) props for jobs
      btnActions: this.getGridActions() //TODO: add all grid related actions
    };
    return (
      <PageContainer>
        <TopNav breadcrumbs={lang.LEFTNAV.MAINTENANCE} projectName={lang.DASHBOARD.AZUREPROJECTNAME} />
        <ContextFilters>
          {pcsBtn(this.contextButtons.delete, showActionBtns)}
          {pcsBtn({ // Change status button
            svg: this.state.toggleButtonSvg,
            onClick: this.showToggleRules,
            value: this.state.toggleButtonText
          }, showActionBtns)}
          {pcsBtn(this.contextButtons.edit, this.state.selectedRulesActions.length === 1)}
          {pcsBtn(this.contextButtons.close, this.state.selectedAlarms.length > 0)}
          {pcsBtn(this.contextButtons.acknowledge, this.state.selectedAlarms.length > 0)}
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
                  label: lang.FORMS.LASTHOUR
                },
                {
                  value: 'P1D',
                  label: lang.FORMS.LASTDAY
                },
                {
                  value: 'P1W',
                  label: lang.FORMS.LASTWEEK
                },
                {
                  value: 'P1M',
                  label: lang.FORMS.LASTMONTH
                }
              ]}
            />
            {`${lang.LAST_REFRESHED} | `}
            <div className="last-refresed-time">{this.state.lastRefresed.toLocaleString()}</div>
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
    alarmsGridData: state.maintenanceReducer.alarmsByRuleGridRowData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MaintenancePage);
