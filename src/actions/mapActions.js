// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import ApiService from '../common/apiService';


export const loadMapkeySuccess = BingMapResponse => {
  return {
    type: types.LOAD_MAPKEY_SUCCESS,
    BingMapKey: BingMapResponse.BingMapKey
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
    return ApiService.getMapKey()
      .then(BingMapResponse => dispatch(loadMapkeySuccess(BingMapResponse)))
      .catch(error => {
        dispatch(loadMapkeyFailed(error));
        throw error;
      });
  };
};
