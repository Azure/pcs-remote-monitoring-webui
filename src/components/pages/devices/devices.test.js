// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { DevicesContainer } from './devices.container';
import { mount } from 'enzyme';
import MockApp from 'components/mocks/mockApp';

describe('Devices Component', () => {
  it('Renders without crashing', () => {
    const wrapper = mount(
      <MockApp>
        <DevicesContainer />
      </MockApp>
    );
  });
});
