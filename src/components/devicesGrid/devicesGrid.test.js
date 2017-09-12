// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { DevicesGrid } from './devicesGrid';
import fetch from 'node-fetch';
import { shallow } from 'enzyme';

window.fetch = fetch;

const props = {
  flyout: {},
  actions: {}
};

it('renders without crashing', async () => {
  shallow(<DevicesGrid {...props} />);
});
