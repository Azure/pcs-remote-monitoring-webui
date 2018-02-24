// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Maintenance } from './maintenance';
import { mount } from 'enzyme';
import { I18n } from 'react-i18next';

import "mocha-steps";

import 'polyfills';

describe('Maintenance Component', () => {
  it('Renders without crashing', () => {
    const wrapper = mount(<Maintenance />);
  });
});
