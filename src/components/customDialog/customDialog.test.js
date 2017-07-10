// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import CustomDialog from './customDialog';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';

window.fetch = fetch;

it('renders without crashing', () => {
  mount(<CustomDialog />);
});

it('contains components', () => {
  const wrapper = shallow(<CustomDialog />);
  expect(wrapper.find('Button')).toHaveLength(2);
  expect(wrapper.find('Modal')).toHaveLength(1);
  expect(wrapper.find('CustomInfo')).toHaveLength(1);
  expect(wrapper.find('CustomLogo')).toHaveLength(1);
  expect(wrapper.find('CustomDevice')).toHaveLength(1);
});


