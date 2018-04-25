// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import moment from 'moment';
import { schema, normalize } from 'normalizr';
import update from 'immutability-helper';
import { createSelector } from 'reselect';
import { redux as appRedux, getActiveDeviceGroupConditions } from './appReducer';
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
    epic: (fromAction, store) => {
      const conditions = getActiveDeviceGroupConditions(store.getState());
      return IoTHubManagerService.getDevices(conditions)
        .map(toActionCreator(redux.actions.updateDevices, fromAction))
        .catch(handleError(fromAction))
    }
  },

  /* Update the devices if the selected device group changes */
  refreshDevices: {
    type: 'DEVICES_REFRESH',
    rawEpic: ($actions) =>
      $actions.ofType(appRedux.actionTypes.updateActiveDeviceGroup)
        .map(({ payload }) => payload)
        .distinctUntilChanged()
        .map(_ => epics.actions.fetchDevices())
  }
});
// ========================= Epics - END

// ========================= Schemas - START
const deviceSchema = new schema.Entity('devices');
const deviceListSchema = new schema.Array(deviceSchema);
// ========================= Schemas - END

// ========================= Reducers - START
const initialState = { ...errorPendingInitialState, entities: {}, items: [], lastUpdated: '' };

const updateDevicesReducer = (state, { payload, fromAction }) => {
  const { entities: { devices }, result } = normalize(payload, deviceListSchema);
  return update(state, {
    entities: { $set: devices },
    items: { $set: result },
    lastUpdated: { $set: moment() },
    ...setPending(fromAction.type, false)
  });
};

const deleteDeviceReducer = (state, { payload }) => {
  const itemIdx = state.items.indexOf(payload);
  return update(state, {
    entities: { $unset: [payload] },
    items: { $splice: [[itemIdx, 1]] }
  });
};

const insertDeviceReducer = (state, { payload }) => {
  const { entities: { devices }, result } = normalize([payload], deviceListSchema);
  return update(state, {
    entities: { $merge: devices },
    items: { $splice: [[state.items.length, 0, result]] }
  });
};

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchDevices
];

export const redux = createReducerScenario({
  updateDevices: { type: 'DEVICES_UPDATE', reducer: updateDevicesReducer },
  registerError: { type: 'DEVICES_REDUCER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer },
  deleteDevice: { type: 'DEVICE_DELETE', reducer: deleteDeviceReducer },
  insertDevice: { type: 'DEVICE_INSERT', reducer: insertDeviceReducer }
});

export const reducer = { devices: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getDevicesReducer = state => state.devices;
export const getEntities = state => getDevicesReducer(state).entities || {};
export const getItems = state => getDevicesReducer(state).items || [];
export const getDevicesLastUpdated = state => getDevicesReducer(state).lastUpdated;
export const getDevicesError = state =>
  getError(getDevicesReducer(state), epics.actionTypes.fetchDevices);
export const getDevicesPendingStatus = state =>
  getPending(getDevicesReducer(state), epics.actionTypes.fetchDevices);
export const getDevices = createSelector(
  getEntities, getItems,
  (entities, items) => items.map(id => entities[id])
);
// ========================= Selectors - END
