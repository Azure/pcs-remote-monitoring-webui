// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { Deployments } from './deployments';

describe('Deployments Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      t: () => {},
      fetchDeployments: () => {},
      updateCurrentWindow: () => { }
    };

    const wrapper = shallow(
      <Deployments {...fakeProps} />
    );
  });
});
