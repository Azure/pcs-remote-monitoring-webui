// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import { schema, normalize } from 'normalizr';
import update from 'immutability-helper';
import { createSelector } from 'reselect';
import { IoTHubManagerService } from 'services';
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
  /** Loads the devices */
  fetchDevices: {
    type: 'DEVICES_FETCH',
    epic: fromAction =>
      IoTHubManagerService.getDevices()
        .map(toActionCreator(redux.actions.updateDevices, fromAction))
        .catch(handleError(fromAction))
  }
});
// ========================= Epics - END

// ========================= Schemas - START
const deviceSchema = new schema.Entity('devices');
const deviceListSchema = new schema.Array(deviceSchema);
// ========================= Schemas - END

// ========================= Reducers - START
const initialState = { ...errorPendingInitialState, entities: {}, items: [] };

const updateDevicesReducer = (state, { payload, fromAction }) => {
  const { entities: { devices }, result } = normalize(payload, deviceListSchema);
  return update(state, {
    entities: { $set: devices },
    items: { $set: result },
    ...setPending(fromAction.type, false)
  });
};

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchDevices
];

export const redux = createReducerScenario({
  updateDevices: { type: 'DEVICES_UPDATE', reducer: updateDevicesReducer },
  registerError: { type: 'DEVICES_REGISTER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer },
});

export const reducer = { devices: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const accessReducer = state => state.devices;
export const getEntities = state => accessReducer(state).entities;
export const getItems = state => accessReducer(state).items;
export const getDevicesError = state =>
  getError(accessReducer(state), epics.actionTypes.fetchDevices);
export const getDevicesPendingStatus = state =>
  getPending(accessReducer(state), epics.actionTypes.fetchDevices);
export const getDevices = createSelector(
  getEntities, getItems,
  (entities, items) => items.map(id => entities[id])
);
// ========================= Selectors - END
