// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';

import { Rules } from './rules';

describe('Rules Component', () => {
  it('Renders without crashing', () => {

    // Pass the devices status
    const fakeProps = {
      rules: [],
      entities: {},
      error: undefined,
      isPending: false,
      deviceGroups: [],
      lastUpdated: undefined,
      fetchRules: () => {},
      changeDeviceGroup: (id) => {},
      t: () => {}
    };

    const wrapper = shallow(
      <Rules {...fakeProps} />
    );
  });
});
