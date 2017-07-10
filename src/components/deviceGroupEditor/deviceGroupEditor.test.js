// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import DeviceGroupEditor from './deviceGroupEditor';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';
import Http from '../../common/httpClient';

window.fetch = fetch;

it('renders without crashing', () => {
  const wrapper = mount(<DeviceGroupEditor />);
});

it('renders top div', () => {
  const wrapper = mount(<DeviceGroupEditor />);
  expect(wrapper.find('.deviceGroupEditorTile')).toHaveLength(1);
});
