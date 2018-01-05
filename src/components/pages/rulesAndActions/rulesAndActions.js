// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PageContainer from '../../layout/pageContainer/pageContainer.js';
import PageContent from '../../layout/pageContent/pageContent.js';
import TopNav from '../../layout/topNav/topNav.js';
import ContextFilters from '../../layout/contextFilters/contextFilters.js';
import RulesActionsList from '../../../components/rulesActionsList/rulesActionsList';
import ManageFilterBtn from '../../shared/contextBtns/manageFiltersBtn';
import * as actions from '../../../actions';
import lang from '../../../common/lang';
import PcsBtn from '../../shared/pcsBtn/pcsBtn';

import AddSvg from '../../../assets/icons/Add.svg';
import EditSvg from '../../../assets/icons/Edit.svg';
import EnableSvg from '../../../assets/icons/Enable.svg';
import DisableSvg from '../../../assets/icons/DisableRule.svg';
import ChangestatusSvg from '../../../assets/icons/Change_status.svg';

class RulesAndActionsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rulesAndActions: undefined,
      selectedRulesActions: [],
      currentNode: null,
      lastRefreshed: new Date(),
      showBoth: false,
      rowData: this.props.rulesAndActions,
      toggleButtonText: lang.DISABLE,
      toggleButtonSvg: ChangestatusSvg,
      softSelectId: ''
    };

    this.contextButtons = {
      newRule: {
        svg: AddSvg,
        onClick: this.newRule,
        value: lang.NEWRULE
      },
      edit: {
        svg: EditSvg,
        onClick: this.showEditRulesFlyout,
        value: lang.EDIT
      }
    };
    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.props.actions.showingRulesPage();
    this.setState(
      { lastRefreshed: new Date(), rowData: undefined },
      () => this.props.actions.loadRulesList()
    );
  }

  componentWillUnmount() { this.props.actions.notShowingRulesPage(); }

  componentWillReceiveProps(nextProps) { this.setState({ rowData: nextProps.rulesAndActions }); }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
  };

  onHardSelectChange = selectedRulesActions => {
    let status;

    // All selected rows have same status field?
    let showBoth = !selectedRulesActions.every(row => {
      if (status === undefined) {
        status = row.Enabled;
      } else if (status !== row.Enabled) {
        return false;
      }
      return true;
    });

    const { actions } = this.props;
    actions.rulesSelectionChanged(selectedRulesActions, this.onUpdateData);

    this.setState({
      selectedRulesActions,
      showBoth: showBoth,
      toggleButtonText: showBoth ? lang.CHANGESTATUS : status ? lang.DISABLE : lang.ENABLE,
      toggleButtonSvg: showBoth ? ChangestatusSvg : status ? DisableSvg : EnableSvg
    });
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

  getSoftSelectId = ({ Id }) => Id;

  onSoftSelectionChange = (rowData, row) => {
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

  showToggleRules = () => {
    const { actions } = this.props;
    const flyoutConfig = {
      onUpdateData: this.onUpdateData,
      selectedRules: this.gridApi.getSelectedRows(),
      type: 'Rule Detail'
    };
    actions.showFlyout(flyoutConfig);
  };

  onUpdateData = data => {
    if (data) {
      if (Array.isArray(data)) {
        data.forEach(newData => {
          this.gridApi.forEachNode(node => {
            if (node.data.Id === newData.Id) {
              node.setData(newData);
            }
          });
        });
        this.onHardSelectChange(data);
      } else if (this.state.currentNode === null) {
        this.gridApi.updateRowData({ add: [data] });
      } else {
        this.state.currentNode.setData(data);
      }
    }
  };

  refreshData() {
    this.setState(
      { lastRefreshed: new Date(), rowData: undefined },
      () => this.props.actions.loadRulesList()
    );
  }

  renderContextFilters() {
    const pcsBtn = (props, visible = true) => (visible ? <PcsBtn {...props} /> : '');
    const { selectedRulesActions } = this.state;
    const showActionBtns = selectedRulesActions.length > 0;

    return (
      <ContextFilters>
        {pcsBtn(this.contextButtons.delete, showActionBtns)}
        {pcsBtn(
          {
            // Change status button
            svg: this.state.toggleButtonSvg,
            onClick: this.showToggleRules,
            value: this.state.toggleButtonText
          },
          showActionBtns
        )}
        {pcsBtn(this.contextButtons.edit, selectedRulesActions.length === 1)}
        {pcsBtn(this.contextButtons.newRule)}
        <ManageFilterBtn />
      </ContextFilters>
    );
  }

  isAllDevices() {
    let selectedGroupConditions = null;
    this.props.deviceGroups.some(group => {
      if (group.Id === this.props.selectedDeviceGroupId) {
        selectedGroupConditions = group.Conditions;
        return true;
      }
      return false;
    });

    return selectedGroupConditions === null || selectedGroupConditions.length === 0;
  }

  render() {
    let rowData = this.state.rowData;
    if (rowData && !this.isAllDevices()) {
      rowData = rowData.filter(rule => rule.GroupId === this.props.selectedDeviceGroupId);
    }
    const rulesAndActionsProps = {
      rowData,
      softSelectId: this.state.softSelectId,
      getSoftSelectId: this.getSoftSelectId,
      onGridReady: this.onGridReady,
      onHardSelectChange: this.onHardSelectChange,
      onSoftSelectChange: this.onSoftSelectionChange,
      showSpinner: this.props.showSpinner
    };

    return (
      <PageContainer>
        <TopNav breadcrumbs={'Rules and Actions'} projectName={lang.AZUREPROJECTNAME} />
        {this.renderContextFilters()}
        <PageContent className="rules-and-actions-conatiner">
          <div className="timerange-selection">
            <span className="last-refreshed-text">{`${lang.LAST_REFRESHED} | `}</span>
            <div className="last-refreshed-time">
              {this.state.lastRefreshed.toLocaleString()}
            </div>
            <div onClick={this.refreshData} className="refresh-icon icon-sm" />
          </div>
          <RulesActionsList {...rulesAndActionsProps} />
        </PageContent>
      </PageContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    deviceGroups: state.filterReducer.deviceGroups,
    selectedDeviceGroupId: state.filterReducer.selectedDeviceGroupId,
    rulesAndActions: state.ruleReducer.rulesAndActions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RulesAndActionsPage);
