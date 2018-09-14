// Copyright (c) Microsoft. All rights reserved.

import { combineReducers } from 'redux';

// Reducers
import { reducer as appReducer } from './reducers/appReducer';
import { reducer as deploymentsReducer } from './reducers/deploymentsReducer';
import { reducer as devicesReducer } from './reducers/devicesReducer';
import { reducer as packagesReducer } from './reducers/packagesReducer';
import { reducer as rulesReducer } from './reducers/rulesReducer';
import { reducer as simulationReducer } from './reducers/deviceSimulationReducer';

const rootReducer = combineReducers({
  ...appReducer,
  ...deploymentsReducer,
  ...devicesReducer,
  ...packagesReducer,
  ...rulesReducer,
  ...simulationReducer
});

export default rootReducer;
