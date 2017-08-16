// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { DeviceList } from './deviceList';
import fetch from 'node-fetch';
import { shallow } from 'enzyme';

window.fetch = fetch;

const props = {
  flyout: {},
  actions: {}
};

it('renders without crashing', async () => {
  shallow(<DeviceList {...props} />);
});
