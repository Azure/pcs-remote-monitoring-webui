// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const deviceReducer = (state = initialState.devices, action) => {
  switch (action.type) {
    case types.LOAD_DEVICES_SUCCESS:
      return {
        ...state,
        devices: action.devices
      };

    case types.LOAD_TELEMETRY_MESSAGES_FOR_MAP_UPDATE_SUCCESS:
      return {
        ...state,
        telemetryByDeviceGroup: action.data
      };

    case types.LOAD_DEVICE_TELEMETRY_SUCCESS:
      return {
        ...state,
        alarmsList: action.data.Items
      };

    case types.LOAD_DEVICES_GROUP_SUCCESS:
      return {
        ...state,
        deviceGroup: action.deviceGroup
      };

    case types.DEVICES_ERROR:
      return {
        ...state,
        error: action.error
      };

    default:
      return state;
  }
};

export default deviceReducer;
