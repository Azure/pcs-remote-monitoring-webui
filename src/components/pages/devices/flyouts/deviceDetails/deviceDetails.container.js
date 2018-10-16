// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeviceDetails } from './deviceDetails';
import { getTheme, getDeviceGroups, getTimeSeriesExplorerUrl } from 'store/reducers/appReducer';
import {
  epics as ruleEpics,
  getEntities as getRulesEntities,
  getRulesLastUpdated,
  getRulesPendingStatus
} from 'store/reducers/rulesReducer';
import {
  getDeviceModuleStatus,
  getDeviceModuleStatusPendingStatus,
  getDeviceModuleStatusError,
  epics as devicesEpics,
  redux as devicesRedux
} from 'store/reducers/devicesReducer';

// Pass the device details
const mapStateToProps = state => ({
  isRulesPending: getRulesPendingStatus(state),
  rules: getRulesEntities(state),
  rulesLastUpdated: getRulesLastUpdated(state),
  deviceGroups: getDeviceGroups(state),
  theme: getTheme(state),
  timeSeriesExplorerUrl: getTimeSeriesExplorerUrl(state),
  deviceModuleStatus: getDeviceModuleStatus(state),
  isDeviceModuleStatusPending: getDeviceModuleStatusPendingStatus(state),
  deviceModuleStatusError: getDeviceModuleStatusError(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchRules: () => dispatch(ruleEpics.actions.fetchRules()),
  fetchModules: (deviceId) => dispatch(devicesEpics.actions.fetchEdgeAgent(deviceId)),
  resetPendingAndError: () => dispatch(devicesRedux.actions.resetPendingAndError(devicesEpics.actions.fetchEdgeAgent))
});

export const DeviceDetailsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(DeviceDetails));
