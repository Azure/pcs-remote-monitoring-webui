// Copyright (c) Microsoft. All rights reserved.

import telemetryReducer from './telemetryReducer';
import * as types from '../actions/actionTypes';
import initialState from './initialState';

describe('telemetry reducer', () => {
  it('should return the initial state', () => {
    expect(telemetryReducer(undefined, {})).toEqual(
      initialState.dashboard.telemetry
    );
  });

  it('should handle SELECT_TELEMETRY_TYPE', () => {
    // TODO add test after remove mock data
    expect(true).toEqual(true);
  });

  it('should handle LOAD_TELEMETRY_TYPES_SUCCESS', () => {
    expect(
      telemetryReducer(
        {},
        {
          type: types.LOAD_TELEMETRY_TYPES_SUCCESS,
          data: { test: 'test' }
        }
      )
    ).toEqual({
      telemetryTypes: { test: 'test' }
    });
  });
});
