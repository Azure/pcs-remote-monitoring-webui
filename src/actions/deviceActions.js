// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';
import * as telemetryActions from './telemetryActions';

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

export const loadDashboardData = (deviceIds) => {
  return dispatch => {
    dispatch(telemetryActions.loadTelemetryMessagesByDeviceIds(deviceIds));
    dispatch(loadDeviceMapAlaramsList(deviceIds));
  };
};

export const loadDevicesByTelemetryMessages = () => {
  return dispatch => {
    return ApiService.getAllDevices()
      .then(data => {
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
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const loadDeviceMapAlaramsList = deviceIds => {
  return dispatch => {
    ApiService.getAlarmsListForDeviceMap(deviceIds.join(','))
      .then(data => {
        dispatch({
          type: types.LOAD_DEVICE_TELEMETRY_SUCCESS,
          data: data
        });
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const loadDevices = () => {
  return dispatch => {
    return ApiService.getAllDevices()
      .then(data => {
        dispatch(loadDeviceSuccess(data));
      })
      .catch(error => {
        dispatch(loadFailed(error));
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
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
