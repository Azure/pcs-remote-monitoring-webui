// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const maintenanceReducer = (state = initialState.maintenance, action) => {
  switch (action.type) {
    case types.LOAD_MAINTENANCE_DATA_SUCCESS:
      return {
        ...state,
        alarmsByRuleGridRowData: action.data,
        alarmsByRule: action.data.alarmsByRule
      };

    default:
      return state;
  }
};

export default maintenanceReducer;
