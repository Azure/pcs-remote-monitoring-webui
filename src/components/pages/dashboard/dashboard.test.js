// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { mount } from 'enzyme';

import { DashboardContainer } from './dashboard.container';
import MockApp from 'components/mocks/mockApp';

describe('Dashboard Component', () => {
  it('Renders without crashing', () => {
    const wrapper = mount(
      <MockApp>
        <DashboardContainer />
      </MockApp>
    );
  });
});
