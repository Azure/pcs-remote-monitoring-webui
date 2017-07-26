// Copyright (c) Microsoft. All rights reserved.

import * as actions from './deviceActions';
import * as types from './actionTypes';

describe('actions', () => {
  it('should create an action to load devices', () => {
    const devices = [
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
      type: types.LOAD_DEVICES_SUCCESS,
      devices
    };
    expect(actions.loadDeviceSuccess(devices)).toEqual(expectedAction);
  });
});
