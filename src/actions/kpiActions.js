import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';

export const loadAlarmListSuccess = data => {
  return {
    type: types.LOAD_ALARMLIST_SUCCESS,
    data
  };
};

export const loadAlarmList = () => {
  return dispatch => {
    return ApiService.getAlarmList()
      .then(data => {
        dispatch(loadAlarmListSuccess(data));
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
