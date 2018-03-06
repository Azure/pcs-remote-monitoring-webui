// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { createAction, createReducerScenario, createEpicScenario } from 'store/utilities';

// ========================= Epics - START
export const epics = createEpicScenario({
  /** Initializes the redux state */
  initializeApp: {
    type: 'APP_INITIALIZE',
    epic: () => [
      // redux.actions.updateDeviceModels(),
    ]
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

// ========================= Reducers - START
const testReducer = (state, action) => ({ ...state, testData: action.payload });

export const redux = createReducerScenario({
  updateDeviceModels: { type: 'TEST_DATA_UPDATE', reducer: testReducer }
});

export const reducer = { app: redux.getReducer() };
// ========================= Reducers - END

// ========================= Selectors - START
// ========================= Selectors - END
