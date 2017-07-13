import * as types from '../actions/actionTypes';
import initialState from './initialState';

const deviceReducer = (state = initialState.dashboard.devices, action) => {
  switch (action.type) {
    case types.LOAD_DEVICES_SUCCESS:
      return {
        ...state,
        devices: action.devices
      }

    default:
      return state;
  }
}

export default deviceReducer;
