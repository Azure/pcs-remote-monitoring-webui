// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import KpiWidget from './kpiWidget';
import fetch from 'node-fetch';
import {shallow } from 'enzyme';
import Http from '../../common/httpClient';

window.fetch = fetch;

it('renders without crashing', () => {
  shallow(<KpiWidget />);
});

it('contains AlarmCounter and KpiChart', () => {
  const wrapper = shallow(<KpiWidget />);
  expect(wrapper.find('AlarmCounter')).toHaveLength(1);
  expect(wrapper.find('KpiChart')).toHaveLength(4);
});






