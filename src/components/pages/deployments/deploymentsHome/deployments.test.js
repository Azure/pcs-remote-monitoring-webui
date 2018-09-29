// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { Deployments } from './deployments';

describe('Deployments Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      t: () => {},
      fetchDeployments: () => {}
    };

    const wrapper = shallow(
      <Deployments {...fakeProps} />
    );
  });
});
