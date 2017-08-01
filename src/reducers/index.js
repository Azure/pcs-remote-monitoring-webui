// Copyright (c) Microsoft. All rights reserved.

import { combineReducers } from 'redux';
import flyoutReducer from './flyoutReducer';
import messageReducer from './messageReducer';
import deviceReducer from './deviceReducer';
import mapReducer from './mapReducer';
import telemetryReducer from './telemetryReducer';
import filterReducer from './filterReducer';

const rootReducer = combineReducers({
  flyoutReducer,
  messageReducer,
  deviceReducer,
  mapReducer,
  telemetryReducer,
  filterReducer
});

export default rootReducer;
