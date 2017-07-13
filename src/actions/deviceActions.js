import * as types from './actionTypes';
import MockApi from '../mock/mockApi';

export const loadDeviceSuccess = devices => {
  return {
    type: types.LOAD_DEVICES_SUCCESS,
    devices
  };
};

export const loadDeviceFailed = error => {
  return {
    type: types.LOAD_DEVICES_FAILED,
    error
  };
};

export const loadDevices = () => {
  return dispatch => {
    return MockApi.getAllDevices()
      .then(devices => {
        dispatch(loadDeviceSuccess(devices));
      })
      .catch(error => {
        dispatch(loadDeviceFailed(error));
        throw error;
      });
  };
};
