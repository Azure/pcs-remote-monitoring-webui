// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';

const defaultState = {
  jobs: undefined,
  loadingInProgress: false,
  loadingError: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case types.LOAD_JOBS_PROGRESS:
      return {
        ...state,
        loadingInProgress: true,
        loadingError: false,
        jobs: action.jobs
      };
      case types.LOAD_JOBS_SUCCESS:
        return {
          ...state,
          loadingInProgress: false,
          loadingError: false,
          jobs: action.jobs
        };
      case types.LOAD_JOBS_FAILURE:
        return {
          ...state,
          loadingInProgress: false,
        };
      default:
      return state;
  }
}
