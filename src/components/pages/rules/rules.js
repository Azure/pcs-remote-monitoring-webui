// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { RulesGrid } from './rulesGrid';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from 'components/app/deviceGroupDropdown';
import { AjaxError, Btn, RefreshBar, PageContent, ContextMenu } from 'components/shared';
import { NewRuleFlyout } from './flyouts';
import { svgs } from 'utilities';

import './rules.css';

const closedFlyoutState = {
  openFlyoutName: '',
  selectedRuleId: undefined
};

export class Rules extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...closedFlyoutState,
      contextBtns: null
    };

    if (!this.props.lastUpdated && !this.props.error) {
      this.props.fetchRules();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPending && nextProps.isPending !== this.props.isPending) {
      // If the grid data refreshes, hide the flyout and deselect soft selections
      this.setState(closedFlyoutState);
    }
  }

  changeDeviceGroup = () => {
    const { changeDeviceGroup, deviceGroups } = this.props;
    changeDeviceGroup(deviceGroups[1].id);
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  openNewRuleFlyout = () => this.setState({
    openFlyoutName: 'newRule',
    selectedRuleId: ''
  });

  onContextMenuChange = contextBtns => this.setState({ contextBtns });

  render() {
    const {
      t,
      rules,
      error,
      isPending,
      lastUpdated,
      fetchRules
    } = this.props;
    const gridProps = {
      rowData: isPending ? undefined : rules || [],
      onContextMenuChange: this.onContextMenuChange,
      t: this.props.t
    };
    return [
      <ContextMenu key="context-menu">
        <DeviceGroupDropdown />
        {this.state.contextBtns}
        <Btn svg={svgs.plus} onClick={this.openNewRuleFlyout}>New rule</Btn>
      </ContextMenu>,
      <PageContent className="rules-container" key="page-content">
        <RefreshBar refresh={fetchRules} time={lastUpdated} isPending={isPending} t={t} />
        { !!error && <AjaxError t={t} error={error} /> }
        {!error && <RulesGrid {...gridProps} />}
        {this.state.openFlyoutName === 'newRule' && <NewRuleFlyout t={t} onClose={this.closeFlyout} />}
      </PageContent>
    ];
  }
}
