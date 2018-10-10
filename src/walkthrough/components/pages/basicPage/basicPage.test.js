// Copyright (c) Microsoft. All rights reserved.

// <test>
import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { BasicPage } from './basicPage';

describe('BasicPage Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      t: () => {},
    };

    const wrapper = shallow(
      <BasicPage {...fakeProps} />
    );
  });
});

// </test>
