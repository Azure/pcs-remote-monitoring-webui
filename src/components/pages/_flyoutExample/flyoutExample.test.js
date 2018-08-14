// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { FlyoutExample } from './flyoutExample';

describe('FlyoutExample Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      t: () => { }
    };

    const wrapper = shallow(
      <FlyoutExample {...fakeProps} />
    );
  });
});
