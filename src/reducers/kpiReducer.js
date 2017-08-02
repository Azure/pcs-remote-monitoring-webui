// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const kpiReducer = (state = initialState.dashboard.kpi, action) => {
  switch (action.type) {
    case types.LOAD_ALARMLIST_SUCCESS:
      return {
        ...state,
        alarmList: action.data.Items
      };

    default:
      return state;
  }
};

export default kpiReducer;
