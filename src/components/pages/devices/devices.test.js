// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Devices } from './devices';
import { mount } from 'enzyme';
import { I18n } from 'react-i18next';

import "mocha-steps";

import 'polyfills';

describe('Devices Component', () => {
  it('Renders without crashing', () => {
    const wrapper = mount(<Devices />);
  });
});
