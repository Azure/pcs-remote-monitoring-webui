import { combineReducers } from 'redux';
import flyoutReducer from './flyoutReducer';
import messageReducer from './messageReducer';
import deviceReducer from './deviceReducer';
import mapReducer from './mapReducer';

const rootReducer = combineReducers({
  flyoutReducer,
  messageReducer,
  deviceReducer,
  mapReducer
});

export default rootReducer;
