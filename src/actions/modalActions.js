import * as types from './actionTypes';

export const showModal = (content, svg=undefined) => {
  return {
    type: types.MODAL_SHOW,
    content: content,
    svg: svg
  };
};

export const hideModal = () => ({ type: types.MODAL_HIDE });
