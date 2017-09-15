// Copyright (c) Microsoft. All rights reserved.

import MockedConfig from '../../mock/config';
import React from 'react';
import ReactDOM from 'react-dom';
import JsonViewer from './jsonViewer';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';
import Http from '../../common/httpClient';

window.fetch = fetch;

it('renders without crashing', () => {
  const wrapper = mount(<JsonViewer />);
});

it('renders two div, one pre and one button', () => {
  const wrapper = shallow(<JsonViewer showButton={true} />);
  expect(wrapper.find('div')).toHaveLength(1);
  expect(wrapper.find('pre')).toHaveLength(1);
  expect(wrapper.find('button')).toHaveLength(1);
});
