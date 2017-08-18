// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const kpiReducer = (state = initialState.dashboard.kpi, action) => {
  switch (action.type) {
    case types.REFRESH_ALL_CHART_DATA_SUCCESS:
      return {
        ...state,
        chartDataFetchComplete: true,
        alarmsList: action.data.alarmsList.Items,
        alarmListLastDuration: action.data.alarmListLastDuration.Items,
        alarmsByRuleLastDuration: action.data.alarmsByRuleLastDuration.Items,
        alarmsByRule: action.data.alarmsByRule.Items
      };
    case types.KPI_REFRESH_CHART_DATA_START:
      return {
        ...state,
        chartDataFetchComplete: false
      };
    default:
      return state;
  }
};

export default kpiReducer;
