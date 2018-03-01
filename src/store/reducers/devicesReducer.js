// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import { IoTHubManagerService } from 'services';
import { toDevicesModel } from 'services/models';
import { createReducerScenario, createEpicScenario } from 'store/utilities';

// Simulation reducer constants
const EMPTY_DEVICES = toDevicesModel();
const initialState = { items: undefined };

// ========================= Reducers - START
const devicesModelReducer = (state, action) => ({ ...state, items: action.payload });
const iotHubManagerErrorReducer = (state, action) => ({ error: action.payload });
const initialStateReducer = (state, action) => initialState;

const updateDevices = { type: 'DEVICES_UPDATE', reducer: devicesModelReducer };

export const redux = createReducerScenario({
  updateDevices,
  clearDevices: { ...updateDevices, type: 'DEVICES_CLEAR', staticPayload: EMPTY_DEVICES },
  registerError: { type: 'DEVICES_ERROR', reducer: iotHubManagerErrorReducer },
  revertToInitial: { type: 'DEVICES_REVERT_TO_INITIAL', reducer: initialStateReducer }
});

export const reducer = { devices: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getDevices = state => state.devices.items;
export const getDevicesError = state => state.devices.error;
// ========================= Selectors - END

// ========================= Epics - START
const devicesError = error => Observable.of(redux.actions.registerError(error.message));

export const epics = createEpicScenario({
  /** Loads the devices */
  fetchDevices: {
    type: 'DEVICES_FETCH',
    epic: () =>
      IoTHubManagerService.getDevices()
        .map(redux.actions.updateDevices)
        .startWith(redux.actions.clearDevices())
        .catch(devicesError)
  }
});
// ========================= Epics - END
