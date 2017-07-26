// Copyright (c) Microsoft. All rights reserved.

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './telemetryActions';
import * as types from './actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  dashboard: {}
});

describe('actions', () => {
  it('should create an action to load messages', () => {
    const data = [
      {
        DeviceId: 'Elevator1',
        Time: '2017-01-14T05:39:45+00:00',
        Body: {
          temperature: '74',
          t_unit: 'F',
          humidity: '41',
          latitude: '47.642272',
          longitude: '-122.103374'
        }
      }
    ];
    const expectedAction = {
      type: types.LOAD_TELEMETRY_TYPES_SUCCESS,
      data
    };
    expect(actions.loadTelemetryTypesSuccess(data)).toEqual(expectedAction);
  });

  it('calls request and success actions if the fetch response was successful', () => {
    return store.dispatch(actions.loadTelemetryByDeviceGroup()).then(data => {
      const expectedActions = store.getActions();
      expect(expectedActions.length).toBe(1);

      expect(expectedActions[0].type).toEqual(
        types.LOAD_TELEMETRY_BY_DEVICEGROUP_SUCCESS
      );
    });
  });
});
