import * as types from './actionTypes';

export const showFlyout = content => {
  return {
    type: types.FLYOUT_SHOW,
    content
  };
};

export const hideFlyout = () => {
  return {
    type: types.FLYOUT_HIDE
  };
};
