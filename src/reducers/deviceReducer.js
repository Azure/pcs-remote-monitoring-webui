// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const deviceReducer = (state = initialState.dashboard.devices, action) => {
  switch (action.type) {
    case types.LOAD_DEVICES_SUCCESS:
      return {
        ...state,
        devices: action.devices
      };

    case types.LOAD_DEVICES_GROUP_SUCCESS:
      return {
        ...state,
        deviceGroup: action.deviceGroup
      };

    default:
      return state;
  }
};

export default deviceReducer;
