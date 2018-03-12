// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { AlarmsPanel } from './alarmsPanel';
import {
  epics as rulesEpics,
  getRulesPendingStatus,
  getRulesLastUpdated
} from 'store/reducers/rulesReducer';
import {
  epics as alarmEpics,
  getAlarmsWithRuleName,
  getAlarmsError,
  getAlarmsPendingStatus
} from 'store/reducers/alarmsReducer';

// Pass the devices status
const mapStateToProps = state => ({
  alarms: getAlarmsWithRuleName(state),
  error: getAlarmsError(state),
  isPending: getAlarmsPendingStatus(state) || getRulesPendingStatus(state),
  rulesLastUpdated: getRulesLastUpdated(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchRules: () => dispatch(rulesEpics.actions.fetchRules()),
  fetchAlarms: () => dispatch(alarmEpics.actions.fetchAlarms())
});

export const AlarmsPanelContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(AlarmsPanel));
