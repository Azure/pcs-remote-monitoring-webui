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

export const updateTwinJobs = job => {
  return {
    type: types.UPDATE_TWIN_JOBS,
    job
  };
};

export const removeTwinJob = jobId => {
  return {
    type: types.REMOVE_TWIN_JOB,
    jobId
  };
};

export const updatePropertyJobs = job => {
  return {
    type: types.UPDATE_PROPERTY_JOBS,
    job
  };
};

export const removePropertyJob = jobId => {
  return {
    type: types.REMOVE_PROPERTY_JOB,
    jobId
  };
};

export const updateJobs = job => {
  return {
    type: types.UPDATE_JOBS,
    job
  };
};

export const loadJobsForTimePeriod = (from) => {
  return dispatch => {
    dispatch({ type: types.LOAD_JOBS_PROGRESS });
    return IotHubManagerService.getJobsForTimePeriod(from)
      .then(jobs => dispatch(loadJobsSuccess(jobs)))
      .catch(error => {
        dispatch(loadJobsFailed(error));
        throw error;
      });
  };
};
