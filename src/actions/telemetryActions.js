// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { indicatorStart, indicatorEnd } from './indicatorActions';
import ApiService from '../common/apiService';
import lang from '../common/lang';

export const loadTelemetryTypesSuccess = data => {
  return {
    type: types.LOAD_TELEMETRY_TYPES_SUCCESS,
    data
  };
};

export const updateTelemetrMessagesSuccess = data => {
  return {
    type: types.UPDATE_TELEMETRY_TYPES_SUCCESS,
    data
  };
};

export const loadTelemetrMessagesSuccess = data => {
  return {
    type: types.LOAD_TELEMETRY_MESSAGES_SUCCESS,
    data
  };
};

export const selectTelemetryType = key => {
  return {
    type: types.SELECT_TELEMETRY_TYPE,
    key
  };
};

export const telemetryError = error => {
  return {
    type: types.TELEMETRY_ERROR,
    error
  };
};

export const loadTelemetryTypes = () => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return ApiService.getTelemetryMessages()
      .then(data => {
        dispatch(indicatorEnd('mapInitial'));
        dispatch(loadTelemetryTypesSuccess(data.Properties));
      })
      .catch(error => {
        dispatch(telemetryError(error));
        throw error;
      });
  };
};

//for all telemetry messages
export const loadTelemetryMessages = params => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return ApiService.getTelemetryMessages(params)
      .then(data => {
        dispatch(indicatorEnd('mapInitial'));
        dispatch(loadTelemetrMessagesSuccess(data));
      })
      .catch(error => {
        dispatch(telemetryError(error));
        throw error;
      });
  };
};

// get telemetry messages based on the deviceId's
export const loadTelemetryMessagesByDeviceIds = deviceList => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return deviceList === lang.ALLDEVICES
      ? ApiService.getTelemetryMessages({
          from: 'NOW-PT15M',
          to: 'NOW',
          order: 'desc'
        })
        .then(data => {
          dispatch(loadTelemetrMessagesSuccess(data));
          dispatch(indicatorEnd('mapInitial'));
        })
        .catch(error => {
          dispatch(telemetryError(error));
          throw error;
        })
      : ApiService.getTelemetryMessages({
          from: 'NOW-PT15M',
          to: 'NOW',
          devices: deviceList,
          order: 'desc'
        })
        .then(data => {
          dispatch(loadTelemetrMessagesSuccess(data));
          dispatch(indicatorEnd('mapInitial'));
        })
        .catch(error => {
          dispatch(telemetryError(error));
          throw error;
        });
  };
};

// telemetryMessages for last 1 minute
export const loadTelemetryMessagesP1M = deviceList => {
  return dispatch => {
    dispatch(indicatorStart('telemetry'));
    return ApiService.getTelemetryMessageByDeviceIdP1M(deviceList)
      .then(data => {
        dispatch(updateTelemetrMessagesSuccess(data));
        dispatch(indicatorEnd('telemetry'));
      })
      .catch(error => {
        dispatch(telemetryError(error));
        throw error;
      });
  };
};
