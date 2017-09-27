// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const modalReducer = (state = initialState.modal, action) => {
  switch (action.type) {
    case types.MODAL_SHOW:
      return {
        ...state,
        visible: true,
        content: action.content,
        svg: action.svg
      };

    case types.MODAL_HIDE:
      return {
        ...state,
        visible: false
      };

    default:
      return state;
  }
};

export default modalReducer;
