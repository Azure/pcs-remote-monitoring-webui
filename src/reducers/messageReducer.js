import * as types from '../actions/actionTypes';
import initialState from './initialState';

const messageReducer = (state = initialState.dashboard, action) => {
  switch (action.type) {
    case types.LOAD_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: action.messages
      };

    default:
      return state;
  }
};

export default messageReducer;
