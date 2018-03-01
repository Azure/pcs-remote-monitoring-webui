// Copyright (c) Microsoft. All rights reserved.

import { combineReducers } from 'redux';

// Reducers
import { reducer as appReducer } from './reducers/appReducer';
import { reducer as devicesReducer } from './reducers/devicesReducer';

const rootReducer = combineReducers({
  ...appReducer,
  ...devicesReducer
});

export default rootReducer;
