// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { DevicesContainer } from './devices.container';

describe('Devices Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      devices: {},
      entities: {},
      error: undefined,
      isPending: false,
      deviceGroups: [],
      lastUpdated: undefined,
      fetchDevices: () => {},
      changeDeviceGroup: (id) => {},
      t: () => {},
      updateCurrentWindow: () => {},
      logEvent: () => {}
    };

    const wrapper = shallow(
      <DevicesContainer {...fakeProps} />
    );
  });
});
