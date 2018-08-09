// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { Example } from './example';

describe('Example Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      t: () => {},
    };

    const wrapper = shallow(
      <Example {...fakeProps} />
    );
  });
});
