import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';

export const getRegionByDisplayName = deviceGroup => {
  return dispatch => {
    return ApiService.getRegionByDisplayName(deviceGroup)
      .then(data => {
        //Creating the action inline for readability purposes
        dispatch({
          type: types.LOAD_DEVICE_GROUPS_SUCCESS,
          data: data.items
        });
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
