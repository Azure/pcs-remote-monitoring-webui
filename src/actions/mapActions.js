import * as types from './actionTypes';
import MockApi from '../mock/mockApi';

export const loadMapkeySuccess = mapkey => {
  return {
    type: types.LOAD_MAPKEY_SUCCESS,
    mapkey
  };
};

export const loadMapkeyFailed = error => {
  return {
    type: types.LOAD_MAPKEY_FAILED,
    error
  };
};

export const loadMapkey = () => {
  return dispatch => {
    return MockApi.getMapKey()
      .then(mapkey => {
        dispatch(loadMapkeySuccess(mapkey));
      })
      .catch(error => {
        dispatch(loadMapkeyFailed(error));
        throw error;
      });
  };
};
