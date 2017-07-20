// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import DeviceConfig from './deviceConfig';
import fetch from 'node-fetch';
import { mount } from 'enzyme';

window.fetch = fetch;

it('renders without crashing', () => {
    mount(<DeviceConfig />);
});


