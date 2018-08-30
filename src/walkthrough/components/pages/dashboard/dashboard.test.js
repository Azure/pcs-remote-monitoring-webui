// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { Dashboard } from './dashboard';

describe('Dashboard Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      t: () => {}
    };

    const wrapper = shallow(
      <Dashboard {...fakeProps} />
    );
  });
});
