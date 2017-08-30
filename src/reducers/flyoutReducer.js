// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const flyoutReducer = (state = initialState.flyout, action) => {
  switch (action.type) {
    case types.FLYOUT_SHOW:
      return {
        ...state,
        show: true,
        content: action.content
      };

    case types.DEVICE_LIST_ROW_SELECTION_CHANGED:
      return {
        ...state,
        devices: action.data
      };

    case types.DEVICE_LIST_COMMON_TAGS_VALUE_CHANGED:
      return {
        ...state,
        overiddenDeviceTagValues: action.data.newTagValueMap,
        requestInProgress: true
      };

    case types.DEVICE_LIST_COMMON_TAGS_VALUE_CHANGED_SUCCESS: {
      const devices = action.data.devices || [];
      const deviceETags = { ...state.deviceETags };
      devices.forEach(device => {
        deviceETags[device.Id] = device.Etag;
      });
      return {
        ...state,
        deviceETags,
        requestInProgress: false
      };
    }

    case types.FLYOUT_HIDE:
      return {
        ...state,
        show: false
      };

    default:
      return state;
  }
};

export default flyoutReducer;
