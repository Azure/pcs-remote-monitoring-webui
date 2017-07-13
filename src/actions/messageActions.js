import * as types from './actionTypes';
import MockApi from '../mock/mockApi';

export const loadMessageSuccess = messages => {
  return {
    type: types.LOAD_MESSAGE_SUCCESS,
    messages
  };
};

export const loadMessages = () => {
  return dispatch => {
    return MockApi.getAllMessages()
      .then(messages => {
        dispatch(loadMessageSuccess(messages));
      })
      .catch(error => {
        throw error;
      });
  };
};
