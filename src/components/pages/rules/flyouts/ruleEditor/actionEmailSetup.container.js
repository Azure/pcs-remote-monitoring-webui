// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { ActionEmailSetup } from './actionEmailSetup';
import {
  getActionSettings,
  getActionSettingsPendingStatus,
  getActionSettingsError,
  getActionPollingStatus,
  getActionPollingError,
  getActionPollingTimeout,
  getApplicationPermissionsAssigned
} from 'store/reducers/appReducer';
import { epics as appEpics } from 'store/reducers/appReducer';

// Pass device groups
const mapStateToProps = state => ({
  actionSettings: getActionSettings(state),
  actionSettingsIsPending: getActionSettingsPendingStatus(state),
  actionSettingsError: getActionSettingsError(state),
  actionIsPolling: getActionPollingStatus(state),
  actionPollingError: getActionPollingError(state),
  actionPollingTimeout:getActionPollingTimeout(state),
  applicationPermissionsAssigned: getApplicationPermissionsAssigned(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchActionSettings: () => dispatch(appEpics.actions.fetchActionSettings()),
  pollActionSettings: () => dispatch(appEpics.actions.pollActionSettings())
});

export const ActionEmailSetupContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(ActionEmailSetup));
