// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import { loadDeviceSuccess } from './deviceActions';
import ApiService from '../common/apiService';
import * as telemetryActions from './telemetryActions';

function setDefaultDeviceGroupId(dispatch, deviceGroups){
  if (deviceGroups.length > 0) {
    let defaultGroupId = "";
    deviceGroups.some((group) => {
    if (group.Conditions.length === 0) {
      defaultGroupId = group.Id;
        return true;
    }
      return false;
    });
    defaultGroupId = defaultGroupId || deviceGroups[0].Id;
    dispatch({
      type: types.DEVICE_GROUP_CHANGED,
      data: defaultGroupId
    });
  } 
}

export const getRegionByDisplayName = deviceGroup => {
  return dispatch => {
    return ApiService.getRegionByDisplayName(deviceGroup)
      .then(data => {
        //Creating the action inline for readability purposes
        dispatch({
          type: types.LOAD_DEVICE_GROUPS_SUCCESS,
          data: data.items
        });
        setDefaultDeviceGroupId(dispatch, data.items);
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const loadRegionSpecificDevices = (selectedGroupConditions, groupId) => {
  return dispatch => {
    dispatch({
      type: types.DEVICE_GROUP_CHANGED,
      data: groupId
    });
    ApiService.getDevicesForGroup(selectedGroupConditions)
      .then(data => {
        dispatch(loadDeviceSuccess(data));
        if (data && data.items) {
          const deviceIds = data.items.map(device => device.Id);
          dispatch(
            telemetryActions.loadTelemetryMessagesByDeviceIds(deviceIds)
          );
        }
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
