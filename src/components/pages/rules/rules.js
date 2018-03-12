// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { RulesGrid } from './rulesGrid';
import { Btn, RefreshBar } from 'components/shared';
import { RuleDetails } from './flyouts';

import './rules.css';

const closedFlyoutState = {
  flyoutOpen: false,
  selectedRuleId: undefined
};

export class Rules extends Component {
  constructor(props) {
    super(props);

    this.state = closedFlyoutState;

    if (!this.props.lastUpdated) {
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
    const { changeDeviceGroup, deviceGroups }  = this.props;
    changeDeviceGroup(deviceGroups[1].id);
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  onSoftSelectChange = ({ id }) => this.setState({
    flyoutOpen: true,
    selectedRuleId: id
  });

  getSoftSelectId = ({ id }) => id;

  render () {
    const { t, rules, error, isPending, lastUpdated, entities, fetchRules } = this.props;
    const gridProps = {
      rowData: isPending ? undefined : rules || [],
      onSoftSelectChange: this.onSoftSelectChange,
      softSelectId: this.state.selectedRuleId,
      getSoftSelectId: this.getSoftSelectId,
      t: this.props.t
    };
    return (
      <div className="rules-container">
        <RefreshBar refresh={fetchRules} time={lastUpdated} isPending={isPending} t={t} />
        {
          !!error &&
          <span className="status">
            { t('errorFormat', { message: t(error.message, { message: error.errorMessage }) }) }
          </span>
        }
        { !error && <RulesGrid {...gridProps} /> }
        <Btn onClick={this.changeDeviceGroup}>Refresh Device Groups</Btn>
        { this.state.flyoutOpen && <RuleDetails onClose={this.closeFlyout} rule={entities[this.state.selectedRuleId]} /> }
      </div>
    );
  }
}
