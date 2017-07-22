import * as types from './actionTypes';

export const loadSuccess = data => {
  return {
    type: types.AJAX_SUCCESS,
    data
  };
};

export const loadFailed = error => {
  return {
    type: types.AJAX_FAILED,
    error
  };
};
