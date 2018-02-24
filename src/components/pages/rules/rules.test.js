// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Rules } from './rules';
import { mount } from 'enzyme';
import { I18n } from 'react-i18next';

import "mocha-steps";

import 'polyfills';

describe('Rules Component', () => {
  it('Renders without crashing', () => {
    const wrapper = mount(<Rules />);
  });
});
