// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import ApiService from '../common/apiService';
import { indicatorStart, indicatorEnd } from './indicatorActions';
import * as telemetryActions from './telemetryActions';
import lang from '../common/lang';

export const loadDeviceSuccess = devices => {
  return {
    type: types.LOAD_DEVICES_SUCCESS,
    devices
  };
};

export const loadDeviceGroupSuccess = deviceGroup => {
  return {
    type: types.LOAD_DEVICES_GROUP_SUCCESS,
    deviceGroup
  };
};

export const loadDashboardData = (deviceIds = '', timeRange) => {
  return dispatch => {
    dispatch(loadTelemetryMessagesByDeviceIdsForMap(deviceIds, timeRange));
  };
};

export const loadDashboardDataUpdate = (deviceIds) => {
  return dispatch => {
    dispatch(loadTelemetryMessagesByDeviceIdsForMap(deviceIds));
  };
};

export const loadTelemetrMessagesForMapUpdateSuccess = data => {
  return {
    type: types.LOAD_TELEMETRY_MESSAGES_FOR_MAP_UPDATE_SUCCESS,
    data
  };
};

export const devicesError = error => {
  return {
    type: types.DEVICES_ERROR,
    error
  };
};

export const loadTelemetryMessagesByDeviceIdsForMap = (deviceList, timeRange) => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return deviceList === lang.ALLDEVICES
      ? ApiService.getTelemetryMessages({
          from: `NOW-${timeRange}`,
          to: 'NOW',
          order: 'desc'
        })
        .then(data => {
          dispatch(loadTelemetrMessagesForMapUpdateSuccess(data));
          dispatch(indicatorEnd('mapInitial'));
        })
        .catch(error => {
          dispatch(devicesError(error));
          throw error;
        })
      : ApiService.getTelemetryMessages({
          from: `NOW-${timeRange}`,
          to: 'NOW',
          devices: deviceList,
          order: 'desc'
        })
        .then(data => {
          dispatch(loadTelemetrMessagesForMapUpdateSuccess(data));
          dispatch(indicatorEnd('mapInitial'));
        })
        .catch(error => {
          dispatch(devicesError(error));
          throw error;
        });

  };
};

export const loadDevicesByTelemetryMessages = () => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return ApiService.getAllDevices()
      .then(data => {
        dispatch(indicatorEnd('mapInitial'));
        dispatch(loadDeviceSuccess(data));
        if (data && data.items) {
          const deviceIds = data.items.map(device => device.Id);
          dispatch(
            telemetryActions.loadTelemetryMessagesByDeviceIds(deviceIds)
          );
          dispatch(loadDeviceMapAlaramsList(deviceIds));
        }
      })
      .catch(error => {
        dispatch(devicesError(error));
        throw error;
      });
  };
};

export const loadDeviceMapAlaramsList = (deviceList, timeRange) => {
  return dispatch => {
    return deviceList === lang.ALLDEVICES
      ? ApiService.getAlarms({
          from: `NOW-${timeRange}`,
          to: 'NOW',
          order: 'desc'
        })
          .then(data => {
            dispatch({
              type: types.LOAD_DEVICE_TELEMETRY_SUCCESS,
              data
            });
          })
          .catch(error => {
            dispatch(devicesError(error));
            throw error;
          })
      : ApiService.getAlarms({
          from: `NOW-${timeRange}`,
          to: 'NOW',
          devices: deviceList,
          order: 'desc'
        })
          .then(data => {
            dispatch({
              type: types.LOAD_DEVICE_TELEMETRY_SUCCESS,
              data
            });
          })
          .catch(error => {
            dispatch(devicesError(error));
            throw error;
          });
  };
};

export const loadDevices = (deviceGroupFlag) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(indicatorStart('mapInitial'));
    const promise = deviceGroupFlag && state.filterReducer.selectedGroupConditions ?
      ApiService.getDevicesForGroup(state.filterReducer.selectedGroupConditions) : ApiService.getAllDevices()
    return promise.then(data => {
      dispatch(indicatorEnd('mapInitial'));
      dispatch(loadDeviceSuccess(data));
    })
    .catch(error => {
       dispatch(devicesError(error));
       throw error;
     });
  };
};

export const loadDeviceGroup = () => {
  return dispatch => {
    return ApiService.getDeviceGroup()
      .then(devices => {
        dispatch(loadDeviceGroupSuccess(devices));
      })
      .catch(error => {
        dispatch(devicesError(error));
        throw error;
      });
  };
};
