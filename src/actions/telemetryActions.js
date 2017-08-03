import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';
import MockApi from '../mock/mockApi';

export const loadTelemetryTypesSuccess = data => {
  return {
    type: types.LOAD_TELEMETRY_TYPES_SUCCESS,
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

export const loadTelemetryMessages = deviceGroup => {
  return dispatch => {
    return ApiService.getTelemetryMessages(deviceGroup)
      .then(data => {
        dispatch(loadTelemetrMessagesSuccess(data.Items));
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
