// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import DeviceTelemetryService from '../services/deviceTelemetryService';

export const rulesSelectionChanged = (rules, onUpdateData) => {
  return {
    type: types.RULE_LIST_ROW_SELECTION_CHANGED,
    data: { rules, onUpdateData }
  };
};

export const loadRulesSuccess = data => {
  return {
    type: types.LOAD_RULES_SUCCESS,
    data: data.Items
  };
};

export const loadRulesFailed = error => {
  return {
    type: types.LOAD_RULES_FAILED,
    error
  };
};

export const showingRulesPage = () => {
  return {
    type: types.RULE_LIST_SHOWN,
    data: {}
  }
};

export const notShowingRulesPage = () => {
  return {
    type: types.RULE_LIST_HIDDEN,
    data: {}
  }
};

export const loadRulesList = groupId => {
  return (dispatch, getState) => {
    const state = getState();
    return state.filterReducer.selectedDeviceGroupId === "default_AllDevices"
      ? DeviceTelemetryService.getRuleList()
         .then(data => dispatch(loadRulesSuccess(data)))
         .catch(error => {
           dispatch(loadRulesFailed(error));
           throw error;
         })
      : DeviceTelemetryService.getRuleList({groupId: state.filterReducer.selectedDeviceGroupId})
          .then(data => dispatch(loadRulesSuccess(data)))
          .catch(error => {
            dispatch(loadRulesFailed(error));
            throw error;
          });
   };
};
