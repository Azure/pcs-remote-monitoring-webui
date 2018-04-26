// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Maintenance } from './maintenance';
import { getTheme } from 'store/reducers/appReducer';
import {
  epics as rulesEpics,
  getEntities as getRuleEntities,
  getRulesError,
  getRulesPendingStatus,
  getRulesLastUpdated
} from 'store/reducers/rulesReducer';
import { getEntities as getDeviceEntities, getDevicesLastUpdated } from 'store/reducers/devicesReducer';

// Pass the devices status
const mapStateToProps = state => ({
  deviceEntities: getDeviceEntities(state),
  deviceLastUpdated: getDevicesLastUpdated(state),
  rulesEntities: getRuleEntities(state),
  rulesError: getRulesError(state),
  rulesIsPending: getRulesPendingStatus(state),
  rulesLastUpdated: getRulesLastUpdated(state),
  theme: getTheme(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchRules: () => dispatch(rulesEpics.actions.fetchRules())
});

export const MaintenanceContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Maintenance));
