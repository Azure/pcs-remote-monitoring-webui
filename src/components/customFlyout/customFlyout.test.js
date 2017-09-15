// Copyright (c) Microsoft. All rights reserved.

import MockGlobalConfig from '../../mock/config';
import React from 'react';
import CustomFlyout from './customFlyout';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';

window.fetch = fetch;

it('renders without crashing', () => {
  mount(<CustomFlyout />);
});

it('contains components', () => {
  const wrapper = shallow(<CustomFlyout />);
  expect(wrapper.find('Button')).toHaveLength(2);
  expect(wrapper.find('flyout')).toHaveLength(1);
  expect(wrapper.find('CustomInfo')).toHaveLength(1);
  expect(wrapper.find('CustomLogo')).toHaveLength(1);
});


