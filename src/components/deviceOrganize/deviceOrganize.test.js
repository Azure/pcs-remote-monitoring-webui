// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import DeviceOrganize from './deviceOrganize';
import fetch from 'node-fetch';
import { mount } from 'enzyme';

window.fetch = fetch;

it('renders without crashing', () => {
  mount(<DeviceOrganize />);
});