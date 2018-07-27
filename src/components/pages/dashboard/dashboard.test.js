// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { Dashboard } from './dashboard';

describe('Dashboard Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      azureMapsKey: '',
      azureMapsKeyError: undefined,
      azureMapsKeyIsPending: false,
      devices: {},
      devicesError: undefined,
      devicesIsPending: false,
      rules: {},
      rulesError: undefined,
      rulesIsPending: false,
      fetchRules: () => {},
      t: () => {}
    };

    const wrapper = shallow(
      <Dashboard {...fakeProps} />
    );
  });
});
