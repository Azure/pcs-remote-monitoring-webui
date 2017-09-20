// Copyright (c) Microsoft. All rights reserved.

import { combineReducers } from 'redux';
import flyoutReducer from './flyoutReducer';
import deviceReducer from './deviceReducer';
import mapReducer from './mapReducer';
import telemetryReducer from './telemetryReducer';
import filterReducer from './filterReducer';
import kpiReducer from './kpiReducer';
import maintenanceReducer from './maintenanceReducer';

const rootReducer = combineReducers({
  flyoutReducer,
  deviceReducer,
  mapReducer,
  telemetryReducer,
  filterReducer,
  kpiReducer,
  maintenanceReducer
});

export default rootReducer;
