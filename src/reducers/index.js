import { combineReducers } from 'redux';
import flyoutReducer from './flyoutReducer';
import messageReducer from './messageReducer';
import deviceReducer from './deviceReducer';
import mapReducer from './mapReducer';
import telemetryReducer from './telemetryReducer';

const rootReducer = combineReducers({
  flyoutReducer,
  messageReducer,
  deviceReducer,
  mapReducer,
  telemetryReducer
});

export default rootReducer;
