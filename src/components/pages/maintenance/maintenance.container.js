// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Maintenance } from './maintenance';
import {
  epics as rulesEpics,
  getEntities as getRuleEntities,
  getRulesError,
  getRulesPendingStatus,
  getRulesLastUpdated
} from 'store/reducers/rulesReducer';

import { getEntities as getDeviceEntities} from 'store/reducers/devicesReducer';

// Pass the devices status
const mapStateToProps = state => ({
  rulesEntities: getRuleEntities(state),
  rulesError: getRulesError(state),
  rulesIsPending: getRulesPendingStatus(state),
  rulesLastUpdated: getRulesLastUpdated(state),
  deviceEntities: getDeviceEntities(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchRules: () => dispatch(rulesEpics.actions.fetchRules())
});

export const MaintenanceContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Maintenance));
