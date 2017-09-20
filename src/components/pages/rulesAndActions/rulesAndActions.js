// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PageContainer from '../../layout/pageContainer/pageContainer.js';
import PageContent from '../../layout/pageContent/pageContent.js';
import TopNav from '../../layout/topNav/topNav.js';
import ContextFilters from '../../layout/contextFilters/contextFilters.js';
import RulesActionsList from '../../../components/rulesActionsList/rulesActionsList';
import ManageFilterBtn from '../../shared/contextBtns/manageFiltersBtn';
import ApiService from "../../../common/apiService";
import * as actions from "../../../actions";
import lang from '../../../common/lang';
import PcsBtn from '../../shared/pcsBtn/pcsBtn';

import AddSvg from '../../../assets/icons/Add.svg';
import EditSvg from '../../../assets/icons/Edit.svg';
import EnableSvg from '../../../assets/icons/Enable.svg';
import DisableSvg from '../../../assets/icons/Disable.svg';
import ChangestatusSvg from '../../../assets/icons/Change_status.svg';

class RulesAndActionsPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rulesAndActions: [],
      selectedRulesActions: [],
      currentNode: null,
      showBoth: false,
      toggleButtonText: lang.DISABLE,
      toggleButtonSvg: ChangestatusSvg,
      softSelectId: ''
    }

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
  }

  componentDidMount() {
    ApiService.getRuleList()
      .then(({ Items }) => this.setState({ rulesAndActions: Items }));
  }

  /** 
   * Get the grid api options 
   * 
   * @param {Object} gridReadyEvent An object containing access to the grid APIs   
   */
  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
  }

  onHardSelectChange = selectedRulesActions => {
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
      showBoth: showBoth,
      toggleButtonText: showBoth ? lang.CHANGESTATUS : status ? lang.DISABLE : lang.ENABLE,
      toggleButtonSvg: showBoth ? ChangestatusSvg : status ? DisableSvg : EnableSvg,
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
      selectedRules: this.state.selectedRulesActions,
      type: 'Rule Detail'
    };
    actions.showFlyout(flyoutConfig);
  };

  onUpdateData = data => {
    if (data) {
      if (Array.isArray(data)) {
        this.gridApi.updateRowData({ update: data });
      }
      else if (this.state.currentNode === null) {
        this.gridApi.updateRowData({ add: [data] });
      } else {
        this.state.currentNode.setData(data);
      }
    }
  };

  renderContextFilters() {
    const pcsBtn = (props, visible = true) => visible ? <PcsBtn {...props} /> : '';
    const { selectedRulesActions } = this.state;
    const showActionBtns = selectedRulesActions.length > 0;

    return (
      <ContextFilters>
        {pcsBtn(this.contextButtons.delete, showActionBtns)}
        {pcsBtn({ // Change status button
          svg: this.state.toggleButtonSvg,
          onClick: this.showToggleRules,
          value: this.state.toggleButtonText
        }, showActionBtns)}
        {pcsBtn(this.contextButtons.edit, selectedRulesActions.length === 1)}
        {pcsBtn(this.contextButtons.newRule)}
        <ManageFilterBtn />
      </ContextFilters>
    );
  }

  render() {
    const rulesAndActionsProps = {
      rowData: this.state.rulesAndActions,
      softSelectId: this.state.softSelectId,
      getSoftSelectId: this.getSoftSelectId,
      onGridReady: this.onGridReady,
      onHardSelectChange: this.onHardSelectChange,
      onSoftSelectChange: this.onSoftSelectionChange
    };

    return (
      <PageContainer>
        <TopNav breadcrumbs={'Rules and Actions'} projectName={lang.AZUREPROJECTNAME} />
        {this.renderContextFilters()}
        <PageContent>
          <RulesActionsList {...rulesAndActionsProps} />
        </PageContent>
      </PageContainer>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(RulesAndActionsPage);