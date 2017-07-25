// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import DeviceProperty from './deviceProperty';
import fetch from 'node-fetch';
import { mount } from 'enzyme';

window.fetch = fetch;

it('renders without crashing', () => {
    const configProperties = [
        { name: 'Building', value: 4.3, type: 'Number' },
        { name: 'Floor', value: 1, type: 'Number' },
        { name: 'Compus', value: 'Redmond', type: 'String' },
        { name: 'IsNew', value: true, type: 'Boolean' }
    ]
    mount(<DeviceProperty configProperties={configProperties} />);
});