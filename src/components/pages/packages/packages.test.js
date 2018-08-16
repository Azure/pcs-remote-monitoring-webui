// Copyright (c) Microsoft. All rights reserved.


import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { Packages } from './packages';

describe('Packages Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      packages: {},
      entities: {},
      error: undefined,
      isPending: false,
      lastUpdated: undefined,
      fetchPackages: () => {},
      deletePackages: (p) => {},
      t: () => {},
    };

    const wrapper = shallow(
      <Packages {...fakeProps} />
    );
  });
});
