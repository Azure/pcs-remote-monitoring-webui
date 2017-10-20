//Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { indicatorStart, indicatorEnd } from './indicatorActions';
import ApiService from '../common/apiService';

export const refreshAllChartDataSuccess = data => {
  return {
    type: types.REFRESH_ALL_CHART_DATA_SUCCESS,
    data
  };
};

export const kpiError = error => {
  return {
    type: types.KPI_ERROR,
    error
  };
};

export const refreshAllChartData = (
  firstDurationFrom,
  firstDurationTo,
  secondDurationFrom,
  secondDurationTo,
  refreshFlag
) => {
  return (dispatch, getState) => {
    const currentState = getState();
    if (currentState.indicatorReducer.kpi || currentState.kpiReducer.error) {
      return;
    }
    const devices = currentState.deviceReducer.devices;
    const deviceIdsCsv = (devices ? devices.items : []).map(({ Id })=> Id).join(',');
    dispatch(indicatorStart(refreshFlag ? 'kpi' : 'kpiInitial'));
    dispatch({ type: types.KPI_REFRESH_CHART_DATA_START });
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
        dispatch(indicatorEnd('kpi'));
        dispatch(indicatorEnd('kpiInitial'));
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
        dispatch(indicatorEnd('kpi'));
        dispatch(kpiError(error));
        throw error;
      });
  };
};
