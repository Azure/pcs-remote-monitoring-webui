// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function(state = initialState.systemJobs, action) {
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

    case types.UPDATE_JOBS:
      return {
        ...state,
        jobs: [
          ...state.jobs.filter(({ jobId }) => jobId !== action.job.jobId),
          action.job
        ]
      };

    case types.UPDATE_TWIN_JOBS:
      return {
        ...state,
        twinUpdateJobs: [
          ...state.twinUpdateJobs.filter(({ jobId }) => jobId !== action.job.jobId),
          action.job
        ]
      };

    case types.UPDATE_PROPERTY_JOBS:
      return {
        ...state,
        propertyUpdateJobs: [
          ...state.propertyUpdateJobs.filter(({ jobId }) => jobId !== action.job.jobId),
          action.job
        ]
      };

    default:
      return state;
  }
}
