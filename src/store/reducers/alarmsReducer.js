// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import moment from 'moment';
import update from 'immutability-helper';
import { createSelector } from 'reselect';
import { TelemetryService } from 'services';
import { getEntities as getRuleEntities } from './rulesReducer';
import {
  createReducerScenario,
  createEpicScenario,
  errorPendingInitialState,
  pendingReducer,
  errorReducer,
  setPending,
  toActionCreator,
  getPending,
  getError
 } from 'store/utilities';

// ========================= Epics - START
const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

export const epics = createEpicScenario({
  /** Loads the alarms */
  fetchAlarms: {
    type: 'ALARMS_FETCH',
    epic: fromAction =>
      // Call the get rules api to return the rules in alarm
      TelemetryService.getAlarms({
        from: `NOW-${'PT1H'}`,
        to: 'NOW',
        devices: ''
      })
      .map(toActionCreator(redux.actions.updateAlarms, fromAction))
      .catch(handleError(fromAction))
  },
});
// ========================= Epics - END

// ========================= Reducers - START
const initialState = { ...errorPendingInitialState, alarms: [] };

const updateAlarmsReducer = (state, { payload, fromAction }) => update(state, {
  alarms: { $set: payload },
  lastUpdated: { $set: moment() },
  ...setPending(fromAction.type, false)
});

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchAlarms
];

export const redux = createReducerScenario({
  updateAlarms: { type: 'ALARMS_UPDATE', reducer: updateAlarmsReducer },
  registerError: { type: 'ALARMS_REDUCER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer },
});

export const reducer = { alarms: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getAlarmsReducer = state => state.alarms;
export const getAlarms = state => getAlarmsReducer(state).alarms;
export const getAlarmsLastUpdated = state => getAlarmsReducer(state).lastUpdated;
export const getAlarmsError = state =>
  getError(getAlarmsReducer(state), epics.actionTypes.fetchAlarms);
export const getAlarmsPendingStatus = state =>
  getPending(getAlarmsReducer(state), epics.actionTypes.fetchAlarms);
export const getAlarmsWithRuleName = createSelector(
  getAlarms, getRuleEntities,
  (alarms, rules) =>
    alarms.map(alarm => ({
      ...alarm,
      name: (rules[alarm.ruleId] || {}).name
    }))
);
// ========================= Selectors - END
