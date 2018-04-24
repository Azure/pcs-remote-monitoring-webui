// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Btn, PcsGrid } from 'components/shared';
import { rulesColumnDefs, checkboxParams, defaultRulesGridProps } from './rulesGridConfig';
import { isFunc, translateColumnDefs, svgs } from 'utilities';
import { EditRuleFlyout } from '../flyouts'

const closedFlyoutState = {
  openFlyoutName: undefined,
  selectedRule: undefined
};

export class RulesGrid extends Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = closedFlyoutState;

    this.columnDefs = [
      { ...rulesColumnDefs.ruleName, ...checkboxParams },
      rulesColumnDefs.description,
      rulesColumnDefs.severity,
      rulesColumnDefs.filter,
      rulesColumnDefs.trigger,
      rulesColumnDefs.notificationType,
      rulesColumnDefs.status,
      rulesColumnDefs.count,
      rulesColumnDefs.lastTrigger
    ];

    // TODO: This is a temporary example implementation. Remove with a better version
    this.contextBtns = {
      disable: <Btn key="disable">Disable</Btn>,
      edit: <Btn key="edit" svg={svgs.edit} onClick={this.openEditRuleFlyout}>{props.t('rules.flyouts.edit')}</Btn>
    };
  }

  onGridReady = gridReadyEvent => {
    this.deviceGridApi = gridReadyEvent.api;
    gridReadyEvent.api.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  openEditRuleFlyout = () => this.setState({ openFlyoutName: 'edit' });

  setSelectedRule = selectedRule => this.setState({ selectedRule });

  getOpenFlyout = () => {
    switch (this.state.openFlyoutName) {
      case 'edit':
        return <EditRuleFlyout onClose={this.closeFlyout} t={this.props.t} rule={this.state.selectedRule} key="edit-rule-flyout" />
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
        onContextMenuChange(this.contextBtns.disable);
      } else if (selectedRules.length === 1) {
        onContextMenuChange([
          this.contextBtns.disable,
          this.contextBtns.edit
        ]);
        if (isFunc(this.setSelectedRule)) {
          this.setSelectedRule(selectedRules[0]);
        }
      } else {
        onContextMenuChange(null);
      }
    }
    if (isFunc(onHardSelectChange)) {
      onHardSelectChange(selectedRules);
    }
  }

  onSoftSelectChange = (rule, rowEvent) => {
    const { onSoftSelectChange } = this.props;
    this.setState(closedFlyoutState);
    if (isFunc(onSoftSelectChange)) {
      onSoftSelectChange(rule, rowEvent);
    }
    this.setSelectedRule(rule);
    this.openEditRuleFlyout();
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultRulesGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      ...this.props, // Allow default property overrides
      context: {
        t: this.props.t
      },
      /* Grid Events */
      onHardSelectChange: this.onHardSelectChange,
      onGridReady: this.onGridReady,
      onSoftSelectChange: this.onSoftSelectChange
    };

    return ([
      <PcsGrid {...gridProps} key="rules-grid" />,
      this.getOpenFlyout()
    ]);
  }
}
