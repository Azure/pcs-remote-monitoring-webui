// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Dashboard } from './dashboard';
import { mount } from 'enzyme';
import { I18n } from 'react-i18next';

import "mocha-steps";

import 'polyfills';

describe('Dashboard Component', () => {
  it('Renders without crashing', () => {
    const wrapper = mount(<Dashboard />);
  });
});
