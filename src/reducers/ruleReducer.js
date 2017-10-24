// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const ruleReducer = (state = initialState.rules, action) => {
  switch (action.type) {
    case types.LOAD_RULES_SUCCESS:
      return {
        ...state,
        rulesAndActions: action.data
      };
    case types.RULE_LIST_SHOWN:
      return {
        ...state,
        showingRulesPage: true
      };
    case types.RULE_LIST_HIDDEN:
      return {
        ...state,
        showingRulesPage: false
      };
    default: return state;
  }
};

export default ruleReducer;
