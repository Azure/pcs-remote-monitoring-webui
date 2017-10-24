// Copyright (c) Microsoft. All rights reserved.

import { combineReducers } from 'redux';
import flyoutReducer from './flyoutReducer';
import modalReducer from './modalReducer';
import deviceReducer from './deviceReducer';
import mapReducer from './mapReducer';
import telemetryReducer from './telemetryReducer';
import filterReducer from './filterReducer';
import systemStatusJobReducer from './systemStatusJobReducer';
import kpiReducer from './kpiReducer';
import ruleReducer from './ruleReducer';
import maintenanceReducer from './maintenanceReducer';
import deviceListReducer from './deviceListReducer';
import indicatorReducer from './indicatorReducer';

const rootReducer = combineReducers({
  flyoutReducer,
  modalReducer,
  deviceListReducer,
  deviceReducer,
  systemStatusJobReducer,
  mapReducer,
  telemetryReducer,
  filterReducer,
  kpiReducer,
  maintenanceReducer,
  indicatorReducer,
  ruleReducer
});

export default rootReducer;
