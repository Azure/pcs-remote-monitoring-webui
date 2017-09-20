// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';

const defaultState = {
  jobs: [],
  loadingError: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case types.LOAD_JOBS_SUCCESS:
      return {
        ...state,
        loadingError: false,
        jobs: action.jobs
      };
    default:
      return state;
  }
}
