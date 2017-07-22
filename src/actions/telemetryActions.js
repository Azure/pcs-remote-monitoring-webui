import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import MockApi from '../mock/mockApi';

export const loadTelemetryTypesSuccess = data => {
  return {
    type: types.LOAD_TELEMETRY_TYPES_SUCCESS,
    data
  };
};

export const loadTelemetrByDeviceGroupSuccess = data => {
  return {
    type: types.LOAD_TELEMETRY_BY_DEVICEGROUP_SUCCESS,
    data
  };
};

export const selectTelemetryType = key => {
  return {
    type: types.SELECT_TELEMETRY_TYPE,
    key
  };
};

export const toggleTelemetrySubMenu = key => {
  return {
    type: types.TOGGLE_TELEMETRY_TYPE_SUBMENU,
    key
  };
};

export const loadTelemetryTypes = () => {
  return dispatch => {
    return MockApi.getTelemetryTypes()
      .then(data => {
        dispatch(loadTelemetryTypesSuccess(data));
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const loadTelemetryByDeviceGroup = deviceGroup => {
  return dispatch => {
    return MockApi.getTelemetryByDeviceGroup(deviceGroup)
      .then(data => {
        dispatch(loadTelemetrByDeviceGroupSuccess(data.Items));
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
