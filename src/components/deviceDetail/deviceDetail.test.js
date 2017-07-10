// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import DeviceDetail from './deviceDetail';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';
import Http from '../../common/httpClient';

window.fetch = fetch;

it('renders without crashing', () => {
  const wrapper = shallow(<DeviceDetail />);
});
