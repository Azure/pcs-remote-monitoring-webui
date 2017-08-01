import * as types from '../actions/actionTypes';
import initialState from './initialState';

const filterReducer = (state = initialState.filter, action) => {
  switch (action.type) {
    case types.LOAD_DEVICE_GROUPS_SUCCESS:
      return {
        ...state,
        deviceGroups: action.data
      };
    case types.DEVICE_GROUP_CHANGED:
      return {
        ...state,
        selectedDeviceGroupId: action.selectedGroupId
      };
    default:
      return state;
  }
};
export default filterReducer;
