import * as types from './actionTypes';

export const showModal = (content, to, svg=undefined) => {
  return {
    type: types.MODAL_SHOW,
    content,
    to,
    svg
  };
};

export const hideModal = () => ({ type: types.MODAL_HIDE });
