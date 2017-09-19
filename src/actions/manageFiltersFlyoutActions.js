// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';

function showManageFilters(dispatch, getState) {
  const state = getState();
  dispatch({
    type: types.FLYOUT_SHOW,
    content: {
      type: 'Manage Filters',
      deviceGroups: state.filterReducer.deviceGroups
    }
  });
}

export const saveOrUpdateFilter = group => {
  return (dispatch, getState) => {
    if (group.Id === 0) {
      return ApiService.postManageFiltersFlyout(group)
        .then(data => {
          dispatch({
            type: types.MANAGE_FILTERS_FLYOUT_SAVE_SUCCESS,
            data: data
          });
          showManageFilters(dispatch, getState);
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        });
    } else {
      return ApiService.updateManageFiltersFlyout(group)
        .then(data => {
          dispatch({
            type: types.MANAGE_FILTERS_FLYOUT_UPDATE_SUCCESS,
            data: data
          });
          showManageFilters(dispatch, getState);
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        });
    }
  };
};

export const deleteFilter = group => {
  return (dispatch, getState) => {
    return ApiService.deleteManageFiltersFlyout(group)
      .then(data => {
        dispatch({
          type: types.MANAGE_FILTERS_FLYOUT_DELETE_SUCCESS,
          data: {
            id: group.Id
          }
        });
        showManageFilters(dispatch, getState);
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const getDeviceGroupFilters = () => {
  return dispatch => {
    return ApiService.getDeviceGroupFilters()
      .then(data => {
        dispatch({
          type: types.LOAD_FIELDS_SUCCESS,
          data: data
        });
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
