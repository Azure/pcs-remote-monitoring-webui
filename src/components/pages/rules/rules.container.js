// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Rules } from './rules';
import {
  epics as rulesEpics,
  getRules,
  getRulesError,
  getRulesLastUpdated,
  getRulesPendingStatus
} from 'store/reducers/rulesReducer';
import { redux as appRedux, getDeviceGroups } from 'store/reducers/appReducer';

// Pass the devices status
const mapStateToProps = state => ({
  rules: getRules(state),
  error: getRulesError(state),
  isPending: getRulesPendingStatus(state),
  deviceGroups: getDeviceGroups(state),
  lastUpdated: getRulesLastUpdated(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchRules: () => dispatch(rulesEpics.actions.fetchRules()),
  changeDeviceGroup: (id) => dispatch(appRedux.actions.updateActiveDeviceGroup(id))
});

export const RulesContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Rules));
