//Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';

export const refreshAllChartDataSuccess = data => {
  return {
    type: types.REFRESH_ALL_CHART_DATA_SUCCESS,
    data
  };
};

export const refreshAllChartData = (
  firstDurationFrom,
  firstDurationTo,
  secondDurationFrom,
  secondDurationTo
) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const devices = currentState.deviceReducer.devices;
    const deviceIdsCsv = devices.items.map(device => device.Id).join(',');
    dispatch({
      type: types.KPI_REFRESH_CHART_DATA_START
    });
    Promise.all([
      ApiService.getAlarmsByRuleForKpi(
        firstDurationFrom,
        firstDurationTo,
        deviceIdsCsv
      ),
      ApiService.getAlarmsByRuleForKpi(
        secondDurationFrom,
        secondDurationTo,
        deviceIdsCsv
      ),
      ApiService.getAlarmsList(
        firstDurationFrom,
        firstDurationTo,
        deviceIdsCsv
      ),
      ApiService.getAlarmsList(
        secondDurationFrom,
        secondDurationTo,
        deviceIdsCsv
      )
    ])
      .then(dataArray => {
        dispatch(
          refreshAllChartDataSuccess({
            alarmsByRule: dataArray[0],
            alarmsByRuleLastDuration: dataArray[1],
            alarmsList: dataArray[2],
            alarmListLastDuration: dataArray[3]
          })
        );
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
