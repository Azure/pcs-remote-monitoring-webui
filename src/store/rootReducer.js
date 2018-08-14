// Copyright (c) Microsoft. All rights reserved.

import { combineReducers } from 'redux';

// Reducers
import { reducer as exampleReducer } from './reducers/_exampleReducer';
import { reducer as appReducer } from './reducers/appReducer';
import { reducer as simulationReducer } from './reducers/deviceSimulationReducer';
import { reducer as devicesReducer } from './reducers/devicesReducer';
import { reducer as rulesReducer } from './reducers/rulesReducer';

const rootReducer = combineReducers({
  ...exampleReducer,
  ...appReducer,
  ...devicesReducer,
  ...rulesReducer,
  ...simulationReducer
});

export default rootReducer;
