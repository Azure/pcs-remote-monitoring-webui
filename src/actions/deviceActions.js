import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import MockApi from '../mock/mockApi';

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

export const loadDevices = () => {
  return dispatch => {
    return MockApi.getAllDevices()
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
    return MockApi.getDeviceGroup()
      .then(devices => {
        dispatch(loadDeviceGroupSuccess(devices));
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
