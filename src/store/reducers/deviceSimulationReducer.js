// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import update from 'immutability-helper';
import { DeviceSimulationService } from 'services';
import {
  createReducerScenario,
  createEpicScenario,
  errorPendingInitialState,
  toActionCreator,
} from 'store/utilities';

// ========================= Epics - START
const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

export const epics = createEpicScenario({
  /** Loads the simulation status */
  fetchSimulationStatus: {
    type: 'SIMULATION_STATUS_FETCH',
    epic: (fromAction) =>
      DeviceSimulationService.getSimulatedDevices()
        .map(toActionCreator(redux.actions.getSimulationStatus, fromAction))
        .catch(handleError(fromAction))
  },

  /** Toggles the simulation status */
  toggleSimulationStatus: {
    type: 'SIMULATION_TOGGLE_STATUS',
    epic: (fromAction) =>
      DeviceSimulationService.toggleSimulation(fromAction.payload.etag, fromAction.payload.enabled)
        .map(toActionCreator(redux.actions.getSimulationStatus, fromAction))
        .catch(handleError(fromAction))
  }
});
// ========================= Epics - END

// ========================= Reducers - START
const initialState = {
  ...errorPendingInitialState,
  simulationEnabled: undefined,
  simulationEtag: undefined
};

const simulationStatusReducer = (state, { payload, fromAction }) => update(state, {
  simulationEnabled: { $set: payload.enabled },
  simulationEtag: { $set: payload.etag }
});

export const redux = createReducerScenario({
  getSimulationStatus: { type: 'SIMULATION_STATUS', reducer: simulationStatusReducer }
});

export const reducer = { deviceSimulation: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getSimulationReducer = state => state.deviceSimulation;
export const isSimulationEnabled = state => getSimulationReducer(state).simulationEnabled;
export const getSimulationEtag = state => getSimulationReducer(state).simulationEtag;
// ========================= Selectors - END
