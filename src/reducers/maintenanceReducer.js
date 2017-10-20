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

    case types.UPDATE_ALARMS_STATUS:
      return {
        ...state,
        alarmsByRuleGridRowData: state.alarmsByRuleGridRowData.map(rowData => {
          const ruleId = rowData.id;
          if (ruleId === action.data.ruleId) {
            return {
              ...rowData,
              [ruleId]: rowData[ruleId].map(alarm => {
                const alarmId = alarm.Id;
                if (action.data.alarmIds.has(alarmId)) {
                  return {
                    ...alarm,
                    Status: action.data.status
                  };
                }
                return alarm;
              })
            };
          }
          return rowData;
        })
      }

    default:
      return state;
  }
};

export default maintenanceReducer;
