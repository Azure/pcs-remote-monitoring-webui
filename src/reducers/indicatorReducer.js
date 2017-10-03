// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const indicatorReducer = (state = initialState.indicator, action) => {
  switch (action.type) {
    case types.INDICATOR_START:
      return {
        ...state,
        [action.key]: true
      };

    case types.INDICATOR_END:
      return {
        ...state,
        [action.key]: false
      };

    default:
      return state;
  }
};

export default indicatorReducer;
