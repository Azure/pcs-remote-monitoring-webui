// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { mount } from 'enzyme';

import { MaintenanceContainer } from './maintenance.container';
import MockApp from 'components/mocks/mockApp';

describe('Dashboard Component', () => {
  it('Renders without crashing', () => {
    const wrapper = mount(
      <MockApp>
        <MaintenanceContainer />
      </MockApp>
    );
  });
});
