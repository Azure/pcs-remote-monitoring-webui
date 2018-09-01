// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { PageWithFlyout } from './pageWithFlyout';

describe('PageWithFlyout Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      t: () => { }
    };

    const wrapper = shallow(
      <PageWithFlyout {...fakeProps} />
    );
  });
});
