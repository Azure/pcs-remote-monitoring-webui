import * as types from './actionTypes';

export const indicatorStart = key => {
  return {
    type: types.INDICATOR_START,
    key
  };
};

export const indicatorEnd = key => {
  return {
    type: types.INDICATOR_END,
    key
  };
};
