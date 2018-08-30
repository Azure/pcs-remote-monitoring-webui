// Copyright (c) Microsoft. All rights reserved.

import { combineReducers } from 'redux';

// Reducers
import { reducer as appReducer } from 'store/reducers/appReducer';
import { reducer as deviceSimulationReducer } from 'store/reducers/deviceSimulationReducer';
import { reducer as exampleReducer } from './reducers/exampleReducer';

const rootReducer = combineReducers({
  ...appReducer,
  ...deviceSimulationReducer,
  ...exampleReducer
});

export default rootReducer;
