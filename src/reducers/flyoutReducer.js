import * as types from '../actions/actionTypes';
import initialState from './initialState';

const flyoutReducer = (state = initialState.flyout, action) => {
  switch (action.type) {
    case types.FLYOUT_SHOW:
      return {
        ...state,
        show: true,
        content: action.content
      };

    case types.FLYOUT_HIDE:
      return {
        ...state,
        show: false
      };

    default:
      return state;
  }
}

export default flyoutReducer;
