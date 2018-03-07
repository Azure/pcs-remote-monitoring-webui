// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { RulesContainer } from './rules.container';
import { mount } from 'enzyme';
import MockApp from 'components/mocks/mockApp';

describe('Rules Component', () => {
  it('Renders without crashing', () => {
    const wrapper = mount(
      <MockApp>
        <RulesContainer />
      </MockApp>
    );
  });
});
