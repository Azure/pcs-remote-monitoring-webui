// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import RulesGrid from './rulesGrid/rulesGrid';
import { Btn, RefreshBar } from 'components/shared';
import './rules.css';

export class Rules extends Component {
  constructor(props) {
    super(props);

    if (!this.props.rules.length) {
      this.props.fetchRules();
    }
  }

  changeDeviceGroup = () => {
    const { changeDeviceGroup, deviceGroups }  = this.props;
    changeDeviceGroup(deviceGroups[1].id);
  }

  render () {
    const { t, rules, error, isPending, lastUpdated, fetchRules } = this.props;
    return (
      <div className="rules-container">
        <RefreshBar refresh={fetchRules} time={lastUpdated} isPending={isPending} t={t} />
        {
          !!error &&
          <span className="status">
            { t('errorFormat', { message: t(error.message, { message: error.errorMessage }) }) }
          </span>
        }
        { !error && <RulesGrid rowData={isPending ? undefined : rules || []} /> }
        <Btn onClick={this.changeDeviceGroup}>Refresh Device Groups</Btn>
      </div>
    );
  }
}
