// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeviceDetails } from './deviceDetails';
import { getTheme } from 'store/reducers/appReducer';
import {
  epics as ruleEpics,
  getEntities as getRulesEntities,
  getRulesLastUpdated,
  getRulesPendingStatus
} from 'store/reducers/rulesReducer';

// Pass the device details
const mapStateToProps = state => ({
  isRulesPending: getRulesPendingStatus(state),
  rules: getRulesEntities(state),
  rulesLastUpdated: getRulesLastUpdated(state),
  theme: getTheme(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchRules: () => dispatch(ruleEpics.actions.fetchRules()),
});

export const DeviceDetailsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(DeviceDetails));
