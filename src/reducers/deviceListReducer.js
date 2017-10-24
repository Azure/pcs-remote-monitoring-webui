// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';

const deviceListReducer = (state = {}, action) => {
  switch (action.type) {
    case types.DEVICE_LIST_SHOWN:
      return {
        ...state,
        showingDevicesPage: true
      };
    case types.DEVICE_LIST_HIDDEN:
      return {
        ...state,
        showingDevicesPage: false
      };

    default:
      return state;
  }
};

export default deviceListReducer;
