// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import { ConfigService } from 'services';
import { schema, normalize } from 'normalizr';
import { createSelector } from 'reselect';
import update from 'immutability-helper';
import {
  createAction,
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
  /** Initializes the redux state */
  initializeApp: {
    type: 'APP_INITIALIZE',
    epic: () => [
      epics.actions.fetchDeviceGroups(),
      redux.actions.updateActiveDeviceGroup()
    ]
  },

  /** Get the account's device groups */
  fetchDeviceGroups: {
    type: 'APP_DEVICE_GROUPS_FETCH',
    epic: fromAction =>
      ConfigService.getDeviceGroups()
        .map(toActionCreator(redux.actions.updateDeviceGroups, fromAction))
        .catch(handleError(fromAction))
  },

  /** Listen to route events and emit a route change event when the url changes */
  detectRouteChange: {
    type: 'APP_ROUTE_EVENT',
    rawEpic: (action$, store, actionType) =>
      action$
        .ofType(actionType)
        .map(({ payload }) => payload) // payload === pathname
        .distinctUntilChanged()
        .map(createAction('EPIC_APP_ROUTE_CHANGE'))
  }

});
// ========================= Epics - END

// ========================= Schemas - START
const deviceGroupSchema = new schema.Entity('deviceGroups');
const deviceGroupListSchema = new schema.Array(deviceGroupSchema);
// ========================= Schemas - END

// ========================= Reducers - START
const initialState = {
  ...errorPendingInitialState,
  deviceGroups: {},
  activeDeviceGroupId: undefined,
  theme: 'dark'
};

const updateDeviceGroupsReducer = (state, { payload, fromAction }) => {
  const { entities: { deviceGroups } } = normalize(payload, deviceGroupListSchema);
  return update(state, {
    deviceGroups: { $set: deviceGroups },
    ...setPending(fromAction.type, false)
  });
};

const updateActiveDeviceGroupsReducer = (state, { payload }) => {
  return update(state, { activeDeviceGroupId: { $set: payload } });
};

const updateThemeReducer = (state, { payload }) => {
  return update(state, { theme: { $set: payload } });
};

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchDeviceGroups
];

export const redux = createReducerScenario({
  updateDeviceGroups: { type: 'APP_DEVICE_GROUP_UPDATE', reducer: updateDeviceGroupsReducer },
  updateActiveDeviceGroup: { type: 'APP_ACTIVE_DEVICE_GROUP_UPDATE', reducer: updateActiveDeviceGroupsReducer },
  changeTheme: { type: 'APP_CHANGE_THEME', reducer: updateThemeReducer },
  registerError: { type: 'APP_REDUCER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer },
});

export const reducer = { app: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getAppReducer = state => state.app;
export const getTheme = state => getAppReducer(state).theme;
export const getDeviceGroupEntities = state => getAppReducer(state).deviceGroups;
export const getActiveDeviceGroupId = state => getAppReducer(state).activeDeviceGroupId;
export const getDeviceGroupsError = state =>
  getError(getAppReducer(state), epics.actionTypes.fetchDeviceGroups);
export const getDeviceGroupsPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.fetchDeviceGroups);
export const getDeviceGroups = createSelector(
  getDeviceGroupEntities,
  deviceGroups => Object.keys(deviceGroups).map(id => deviceGroups[id])
);
export const getActiveDeviceGroup = createSelector(
  getDeviceGroupEntities, getActiveDeviceGroupId,
  (deviceGroups, activeGroupId) => deviceGroups[activeGroupId]
);
export const getActiveDeviceGroupConditions = createSelector(
  getActiveDeviceGroup,
  activeDeviceGroup => (activeDeviceGroup || {}).conditions
);
// ========================= Selectors - END
