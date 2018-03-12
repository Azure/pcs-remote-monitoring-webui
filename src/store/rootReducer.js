// Copyright (c) Microsoft. All rights reserved.

import { combineReducers } from 'redux';

// Reducers
import { reducer as appReducer } from './reducers/appReducer';
import { reducer as devicesReducer } from './reducers/devicesReducer';
import { reducer as rulesReducer } from './reducers/rulesReducer';
import { reducer as alarmReducer } from './reducers/alarmsReducer';

const rootReducer = combineReducers({
  ...appReducer,
  ...devicesReducer,
  ...rulesReducer,
  ...alarmReducer
});

export default rootReducer;
