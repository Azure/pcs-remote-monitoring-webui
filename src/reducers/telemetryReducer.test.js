// Copyright (c) Microsoft. All rights reserved.

import telemetryReducer from './telemetryReducer';
import * as types from '../actions/actionTypes';
import initialState from './initialState';

const mockState = {
  ...initialState.telemetry,
  radioBtnOptions: {
    key1: { selected: false, chartData: [], deviceNames: [] },
    key2: { selected: false, chartData: [], deviceNames: [] },
    key3: { selected: true, chartData: [], deviceNames: [] }
  }
};

const receivedState = {
  ...mockState,
  radioBtnOptions: {
    key1: { selected: true, chartData: [], deviceNames: [] },
    key2: { selected: false, chartData: [], deviceNames: [] },
    key3: { selected: false, chartData: [], deviceNames: [] }
  },
  timeline: {
    ...mockState.timeline,
    selectedTelemetry: 'key1',
    chartConfig: {
      ...mockState.timeline.chartConfig,
      data: {
        ...mockState.timeline.chartConfig.data,
        json: [],
        keys: {
          ...mockState.timeline.chartConfig.data.keys,
          value: []
        }
      }
    }
  }
};

describe('telemetry reducer', () => {
  it('should return the initial state', () => {
    expect(telemetryReducer(undefined, {})).toEqual(initialState.telemetry);
  });

  it('should handle SELECT_TELEMETRY_TYPE', () => {
    expect(
      telemetryReducer(mockState, {
        type: types.SELECT_TELEMETRY_TYPE,
        key: 'key1'
      })
    ).toEqual(receivedState);
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
