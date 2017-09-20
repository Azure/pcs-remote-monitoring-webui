// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import IotHubManagerService from '../services/iotHubManagerService';

export const loadJobsSuccess = jobs => {
  return {
    type: types.LOAD_JOBS_SUCCESS,
    jobs
  };
};

export const loadJobsFailed = error => {
  return {
    type: types.LOAD_JOBS_FAILURE,
    error
  };
};

export const loadAllJobs = () => {
  return dispatch => {
    return IotHubManagerService.getAllJobs()
      .then(jobs => {
        dispatch(loadJobsSuccess(jobs));
      })
      .catch(error => {
        dispatch(loadJobsFailed(error));
        throw error;
      });
  };
};
