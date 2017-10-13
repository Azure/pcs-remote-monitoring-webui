// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import ApiService from '../common/apiService';

export const devicesSelectionChanged = devices => {
  return {
    type: types.DEVICE_LIST_ROW_SELECTION_CHANGED,
    data: devices
  };
};

export const updateDeviceTwin = jobs => {
  return {
    type: types.UPDATE_DEVICE_TWIN,
    jobs
  };
};

export const deviceListCommonTagsValueChanged = (devices, newTagValueMap) => {
  return dispatch => {
    dispatch({
      type: types.DEVICE_LIST_COMMON_TAGS_VALUE_CHANGED,
      data: {
        devices,
        newTagValueMap
      }
    });

    //call api service for each device and update the tag value
    Promise.all(
      devices.map(device => ApiService.updateDeviceTagValue(device, newTagValueMap[device.Id]))
    ).then(dataArray => {
      dispatch({
        type: types.DEVICE_LIST_COMMON_TAGS_VALUE_CHANGED_SUCCESS,
        data: {
          devices: dataArray
        }
      });
    });
  };
};
