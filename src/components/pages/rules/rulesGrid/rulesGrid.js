// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Trans } from 'react-i18next';

import { permissions, toDiagnosticsModel } from 'services/models';
import { Btn, ComponentArray, PcsGrid, Protected } from 'components/shared';
import { rulesColumnDefs, defaultRulesGridProps } from './rulesGridConfig';
import { checkboxColumn } from 'components/shared/pcsGrid/pcsGridConfig';
import { isFunc, translateColumnDefs, svgs } from 'utilities';
import { EditRuleFlyout, RuleDetailsFlyout, RuleStatusContainer, DeleteRuleContainer } from '../flyouts'

import './rulesGrid.css';

const closedFlyoutState = {
  openFlyoutName: undefined,
  softSelectedRuleId: undefined
};

export class RulesGrid extends Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      ...closedFlyoutState,
      selectedRules: undefined
    };

    this.columnDefs = [
      checkboxColumn,
      rulesColumnDefs.ruleName,
      rulesColumnDefs.description,
      rulesColumnDefs.severity,
      rulesColumnDefs.filter,
      rulesColumnDefs.trigger,
      rulesColumnDefs.notificationType,
      rulesColumnDefs.status,
      rulesColumnDefs.count,
      rulesColumnDefs.lastTrigger
    ];

    this.contextBtns = {
      disable:
        <Protected key="disable" permission={permissions.updateRules}>
          <Btn className="rule-status-btn" svg={svgs.disableToggle} onClick={this.openStatusFlyout}>
            <Trans i18nKey="rules.flyouts.disable">Disable</Trans>
          </Btn>
        </Protected>,
      enable:
        <Protected key="enable" permission={permissions.updateRules}>
          <Btn className="rule-status-btn enabled" svg={svgs.enableToggle} onClick={this.openStatusFlyout}>
            <Trans i18nKey="rules.flyouts.enable">Enable</Trans>
          </Btn>
        </Protected>,
      changeStatus:
        <Protected key="changeStatus" permission={permissions.updateRules}>
          <Btn className="rule-status-btn" svg={svgs.changeStatus} onClick={this.openStatusFlyout}>
            <Trans i18nKey="rules.flyouts.changeStatus">Change status</Trans>
          </Btn>
        </Protected>,
      edit:
        <Protected key="edit" permission={permissions.updateRules}>
          <Btn svg={svgs.edit} onClick={this.openEditRuleFlyout}>
            {props.t('rules.flyouts.edit')}
          </Btn>
        </Protected>,
      delete:
        <Protected key="delete" permission={permissions.deleteRules}>
          <Btn svg={svgs.trash} onClick={this.openDeleteFlyout}>
            <Trans i18nKey="rules.flyouts.delete">Delete</Trans>
          </Btn>
        </Protected>
    };
  }

  componentWillReceiveProps({ rowData }) {
    const { selectedRules = [], softSelectedRuleId } = this.state;
    if (rowData && (selectedRules.length || softSelectedRuleId)) {
      let updatedSoftSelectedRule = undefined;
      const selectedIds = new Set(selectedRules.map(({ id }) => id));
      const updatedSelectedRules = rowData.reduce((acc, rule) => {
        if (selectedIds.has(rule.id)) acc.push(rule);
        if (softSelectedRuleId && rule.id === softSelectedRuleId) {
          updatedSoftSelectedRule = rule;
        }
        return acc;
      }, []);
      this.setState({
        selectedRules: updatedSelectedRules,
        softSelectedRuleId: (updatedSoftSelectedRule || {}).id
      });
    }
  }

  openEditRuleFlyout = () => {
    this.props.logEvent(toDiagnosticsModel('Rule_EditClick', {}));
    this.setState({ openFlyoutName: 'edit' });
  }

  openStatusFlyout = () => this.setState({ openFlyoutName: 'status' });

  openDeleteFlyout = () => this.setState({ openFlyoutName: 'delete' });

  setSelectedRules = selectedRules => this.setState({ selectedRules });

  getOpenFlyout = () => {
    switch (this.state.openFlyoutName) {
      case 'view':
        return <RuleDetailsFlyout onClose={this.closeFlyout} t={this.props.t} ruleId={this.state.softSelectedRuleId || this.state.selectedRules[0].id} key="view-rule-flyout" logEvent={this.props.logEvent} />
      case 'edit':
        return <EditRuleFlyout onClose={this.closeFlyout} t={this.props.t} ruleId={this.state.softSelectedRuleId || this.state.selectedRules[0].id} key="edit-rule-flyout" logEvent={this.props.logEvent} />
      case 'status':
        return <RuleStatusContainer onClose={this.closeFlyout} t={this.props.t} rules={this.state.selectedRules} key="edit-rule-flyout" />
      case 'delete':
        return <DeleteRuleContainer onClose={this.closeFlyout} t={this.props.t} rule={this.state.selectedRules[0]} key="delete-rule-flyout" refresh={this.props.refresh} />
      default:
        return null;
    }
  }

  /**
   * Handles context filter changes and calls any hard select props method
   *
   * @param {Array} selectedRules A list of currently selected rules
   */
  onHardSelectChange = (selectedRules) => {
    const { onContextMenuChange, onHardSelectChange } = this.props;
    if (isFunc(onContextMenuChange)) {
      if (selectedRules.length > 1) {
        this.setSelectedRules(selectedRules);
        onContextMenuChange(this.contextBtns.changeStatus);
      } else if (selectedRules.length === 1) {
        this.setSelectedRules(selectedRules);
        if (!selectedRules[0].deleted) {
          onContextMenuChange([
            this.contextBtns.delete,
            selectedRules[0].enabled ? this.contextBtns.disable : this.contextBtns.enable,
            this.contextBtns.edit
          ]);
        } else {
          onContextMenuChange(null);
        }
      } else {
        onContextMenuChange(null);
      }
    }
    if (isFunc(onHardSelectChange)) {
      onHardSelectChange(selectedRules);
    }
  }

  onSoftSelectChange = (ruleId) => {
    const { onSoftSelectChange, suppressFlyouts } = this.props;
    if (!suppressFlyouts) {
      if (ruleId) {
        this.setState({
          openFlyoutName: 'view',
          softSelectedRuleId: ruleId
        });
      } else {
        this.closeFlyout();
      }
    }
    if (isFunc(onSoftSelectChange)) {
      onSoftSelectChange(ruleId);
    }
  }

  getSoftSelectId = ({ id } = '') => id;

  closeFlyout = () => this.setState(closedFlyoutState);

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultRulesGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      sizeColumnsToFit: true,
      getSoftSelectId: this.getSoftSelectId,
      softSelectId: this.state.softSelectedRuleId || {},
      deltaRowDataMode: true,
      ...this.props, // Allow default property overrides
      getRowNodeId: ({ id }) => id,
      enableSorting: true,
      unSortIcon: true,
      context: {
        t: this.props.t,
        deviceGroups: this.props.deviceGroups
      },
      /* Grid Events */
      onRowClicked: ({ node }) => node.setSelected(!node.isSelected()),
      onHardSelectChange: this.onHardSelectChange,
      onSoftSelectChange: this.onSoftSelectChange
    };

    return (
      <ComponentArray>
        <PcsGrid {...gridProps} />
        {this.props.suppressFlyouts ? null : this.getOpenFlyout()}
      </ComponentArray>
    );
  }
}
