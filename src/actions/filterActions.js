import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import MockApi from '../mock/mockApi';

export const getRegionByDisplayName = deviceGroup => {
  return dispatch => {
    return MockApi.getRegionByDisplayName(deviceGroup)
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
