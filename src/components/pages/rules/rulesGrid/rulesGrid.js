// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Trans } from 'react-i18next';

import { Btn, PcsGrid } from 'components/shared';
import { rulesColumnDefs, defaultRulesGridProps } from './rulesGridConfig';
import { checkboxColumn } from 'components/shared/pcsGrid/pcsGridConfig';
import { isFunc, translateColumnDefs, svgs } from 'utilities';
import { EditRuleFlyout, RuleStatusContainer } from '../flyouts'

import './rulesGrid.css';

const closedFlyoutState = {
  openFlyoutName: undefined,
  softSelectedRule: undefined
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
        <Btn key="disable" className="rule-status-btn" svg={svgs.disableToggle} onClick={this.openStatusFlyout}>
          <Trans i18nKey="rules.flyouts.disable">Disable</Trans>
        </Btn>,
      enable:
        <Btn key="enable" className="rule-status-btn enabled" svg={svgs.enableToggle} onClick={this.openStatusFlyout}>
          <Trans i18nKey="rules.flyouts.enable">Enable</Trans>
        </Btn>,
      changeStatus:
        <Btn key="changeStatus" className="rule-status-btn" svg={svgs.changeStatus} onClick={this.openStatusFlyout}>
          <Trans i18nKey="rules.flyouts.changeStatus">Change status</Trans>
        </Btn>,
      edit:
        <Btn key="edit" svg={svgs.edit} onClick={this.openEditRuleFlyout}>
          {props.t('rules.flyouts.edit')}
        </Btn>
    };
  }

  openEditRuleFlyout = () => this.setState({ openFlyoutName: 'edit' });

  openStatusFlyout = () => this.setState({ openFlyoutName: 'status' });

  setSelectedRules = selectedRules => this.setState({ selectedRules });

  getOpenFlyout = () => {
    switch (this.state.openFlyoutName) {
      case 'edit':
        return <EditRuleFlyout onClose={this.closeFlyout} t={this.props.t} rule={this.state.softSelectedRule || this.state.selectedRules[0]} key="edit-rule-flyout" />
      case 'status':
        return <RuleStatusContainer onClose={this.closeFlyout} t={this.props.t} rules={this.state.selectedRules} key="edit-rule-flyout" />
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
        onContextMenuChange([
          selectedRules[0].enabled ? this.contextBtns.disable : this.contextBtns.enable,
          this.contextBtns.edit
        ]);
      } else {
        onContextMenuChange(null);
      }
    }
    if (isFunc(onHardSelectChange)) {
      onHardSelectChange(selectedRules);
    }
  }

  onSoftSelectChange = (rule, rowEvent) => {
    const { onSoftSelectChange, suppressFlyouts } = this.props;
    if (!suppressFlyouts) {
      if (rule) {
        this.setState({
          openFlyoutName: 'edit',
          softSelectedRule: rule
        });
      } else {
        this.closeFlyout();
      }
    }
    if (isFunc(onSoftSelectChange)) {
      onSoftSelectChange(rule, rowEvent);
    }
  }

  getSoftSelectId = ({ id } = {}) => id;

  closeFlyout = () => this.setState(closedFlyoutState);

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultRulesGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      sizeColumnsToFit: true,
      getSoftSelectId: this.getSoftSelectId,
      softSelectId: (this.state.softSelectedRule || {}).id,
      ...this.props, // Allow default property overrides
      deltaRowDataMode: true,
      getRowNodeId: ({ id }) => id,
      context: {
        t: this.props.t
      },
      /* Grid Events */
      onRowClicked: ({ node }) => node.setSelected(!node.isSelected()),
      onHardSelectChange: this.onHardSelectChange,
      onSoftSelectChange: this.onSoftSelectChange
    };

    return ([
      <PcsGrid {...gridProps} key="rules-grid" />,
      this.props.suppressFlyouts ? null : this.getOpenFlyout()
    ]);
  }
}
