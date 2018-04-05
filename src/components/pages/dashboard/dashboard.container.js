// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getAzureMapsKey } from 'store/reducers/appReducer';
import { epics as rulesEpics } from 'store/reducers/rulesReducer';
import {
  getEntities as getRuleEntities,
  getRulesPendingStatus,
  getRulesError
} from 'store/reducers/rulesReducer';
import {
  getEntities as getDeviceEntities,
  getDevicesPendingStatus,
  getDevicesError
} from 'store/reducers/devicesReducer';

import { Dashboard } from './dashboard';

const mapStateToProps = state => ({
  rules: getRuleEntities(state),
  devices: getDeviceEntities(state),
  rulesIsPending: getRulesPendingStatus(state),
  devicesIsPending: getDevicesPendingStatus(state),
  rulesError: getRulesError(state),
  devicesError: getDevicesError(state),
  azureMapsKey: getAzureMapsKey(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchRules: () => dispatch(rulesEpics.actions.fetchRules())
})

export const DashboardContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
