// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { permissions, toDiagnosticsModel } from 'services/models';
import { RulesGrid } from './rulesGrid';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from 'components/shell/deviceGroupDropdown';
import { ManageDeviceGroupsBtnContainer as ManageDeviceGroupsBtn } from 'components/shell/manageDeviceGroupsBtn';
import {
  AjaxError,
  Btn,
  ContextMenu,
  ContextMenuAlign,
  PageContent,
  Protected,
  RefreshBar,
  SearchInput
 } from 'components/shared';
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

    this.props.updateCurrentWindow('Rules');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPending && nextProps.isPending !== this.props.isPending) {
      // If the grid data refreshes, hide the flyout and deselect soft selections
      this.setState(closedFlyoutState);
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  openNewRuleFlyout = () => {
    const { logEvent } = this.props;
    this.setState({
      openFlyoutName: 'newRule',
      selectedRuleId: ''
    });
    logEvent(toDiagnosticsModel('Rule_NewClick', {}));
  }

  onGridReady = gridReadyEvent => this.rulesGridApi = gridReadyEvent.api;

  searchOnChange = ({ target: { value } }) => {
    if (this.rulesGridApi) this.rulesGridApi.setQuickFilter(value);
  };

  onContextMenuChange = contextBtns => this.setState({ contextBtns });

  render() {
    const {
      t,
      rules,
      error,
      isPending,
      lastUpdated,
      fetchRules,
      logEvent
    } = this.props;
    const gridProps = {
      onGridReady: this.onGridReady,
      rowData: isPending ? undefined : rules || [],
      onContextMenuChange: this.onContextMenuChange,
      t: this.props.t,
      deviceGroups: this.props.deviceGroups,
      refresh: fetchRules,
      logEvent: this.props.logEvent
    };
    return [
      <ContextMenu key="context-menu">
        <ContextMenuAlign key="left" left={true}>
          <DeviceGroupDropdown />
          <Protected permission={permissions.updateDeviceGroups}>
            <ManageDeviceGroupsBtn />
          </Protected>
        </ContextMenuAlign>
        <ContextMenuAlign key="right">
          <SearchInput onChange={this.searchOnChange} placeholder={t('rules.searchPlaceholder')} />
          {this.state.contextBtns}
          <Protected permission={permissions.createRules}>
            <Btn svg={svgs.plus} onClick={this.openNewRuleFlyout}>{t('rules.flyouts.newRule')}</Btn>
          </Protected>
        </ContextMenuAlign>
      </ContextMenu>,
      <PageContent className="rules-container" key="page-content">
        <RefreshBar refresh={fetchRules} time={lastUpdated} isPending={isPending} t={t} />
        { !!error && <AjaxError t={t} error={error} /> }
        {!error && <RulesGrid {...gridProps} />}
        {this.state.openFlyoutName === 'newRule' && <NewRuleFlyout t={t} onClose={this.closeFlyout} logEvent={logEvent} />}
      </PageContent>
    ];
  }
}
