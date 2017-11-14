// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import { loadDeviceSuccess } from './deviceActions';
import { indicatorStart, indicatorEnd } from './indicatorActions';
import ApiService from '../common/apiService';
import * as telemetryActions from './telemetryActions';
import * as kpiActions from './kpiActions';
import lang from '../common/lang';

function setDefaultDeviceGroupId(dispatch, deviceGroups){
  if (deviceGroups.length > 0) {
    let defaultGroupId = '';
    deviceGroups.some(({ Id, Conditions }) => {
      if (Conditions.length === 0) {
        defaultGroupId = Id;
        return true;
      }
      return false;
    });
    defaultGroupId = defaultGroupId || deviceGroups[0].Id;
    dispatch({
      type: types.DEVICE_GROUP_CHANGED,
      data: {groupId: defaultGroupId}
    });
  }
}

export const getRegionByDisplayName = deviceGroup => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return ApiService.getRegionByDisplayName(deviceGroup)
      .then(data => {
        dispatch(indicatorEnd('mapInitial'));
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
  return (dispatch, getState) => {
    const state = getState();
    dispatch({
      type: types.DEVICE_GROUP_CHANGED,
      data: {groupId, selectedGroupConditions}
    });
    dispatch(indicatorStart('mapInitial'));
    dispatch(indicatorStart('kpiInitial'));
    selectedGroupConditions.length === 0
      ? ApiService.getDevicesForGroup(selectedGroupConditions)
        .then(data => {
          dispatch(loadDeviceSuccess(data));
          if (state.deviceListReducer.showingDevicesPage || state.ruleReducer.showingRulesPage) return;
          if (data && data.items) {
            dispatch( telemetryActions.loadTelemetryMessagesByDeviceIds(lang.ALLDEVICES) );
            dispatch(kpiActions.refreshAllChartData(null,null,null,null));
            dispatch(indicatorEnd('mapInitial'));
            dispatch(indicatorEnd('kpiInitial'));
          }
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        })
      : ApiService.getDevicesForGroup(selectedGroupConditions)
        .then(data => {
          dispatch(loadDeviceSuccess(data));
          if (state.deviceListReducer.showingDevicesPage || state.ruleReducer.showingRulesPage) return;
          if (data && data.items) {
            const deviceIds = data.items.map(device => device.Id);
            dispatch( telemetryActions.loadTelemetryMessagesByDeviceIds(deviceIds) );
            dispatch(kpiActions.refreshAllChartData(null,null,null,null));
            dispatch(indicatorEnd('mapInitial'));
            dispatch(indicatorEnd('kpiInitial'));
          }
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        });
  };
};
