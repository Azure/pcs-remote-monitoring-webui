// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import {
  redux as appRedux,
  getActiveDeviceGroup,
  getAzureMapsKey,
  getSolutionSettingsError,
  getSolutionSettingsPendingStatus,
  getDeviceGroups,
  getDeviceGroupError,
  getTheme,
  getTimeInterval,
  getTimeSeriesExplorerUrl
} from 'store/reducers/appReducer';
import {
  epics as rulesEpics,
  getEntities as getRuleEntities,
  getRulesPendingStatus,
  getRulesError
} from 'store/reducers/rulesReducer';
import {
  getDevicesError,
  getDevicesLastUpdated,
  getDevicesPendingStatus,
  getEntities as getDeviceEntities
} from 'store/reducers/devicesReducer';

import { Dashboard } from './dashboard';

const mapStateToProps = state => ({
  activeDeviceGroup: getActiveDeviceGroup(state),
  azureMapsKey: getAzureMapsKey(state),
  azureMapsKeyError: getSolutionSettingsError(state),
  azureMapsKeyIsPending: getSolutionSettingsPendingStatus(state),
  deviceGroups: getDeviceGroups(state),
  deviceGroupError: getDeviceGroupError(state),
  deviceLastUpdated: getDevicesLastUpdated(state),
  devices: getDeviceEntities(state),
  devicesError: getDevicesError(state),
  devicesIsPending: getDevicesPendingStatus(state),
  rules: getRuleEntities(state),
  rulesError: getRulesError(state),
  rulesIsPending: getRulesPendingStatus(state),
  theme: getTheme(state),
  timeInterval: getTimeInterval(state),
  timeSeriesExplorerUrl: getTimeSeriesExplorerUrl(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchRules: () => dispatch(rulesEpics.actions.fetchRules()),
  updateTimeInterval: timeInterval => dispatch(appRedux.actions.updateTimeInterval(timeInterval)),
  updateCurrentWindow: (currentWindow) => dispatch(appRedux.actions.updateCurrentWindow(currentWindow))
});

export const DashboardContainer = withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
