// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { Maintenance } from './maintenance';

describe('Dashboard Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      rulesEntities: {},
      rulesError: undefined,
      rulesIsPending: false,
      rulesLastUpdated: undefined,
      deviceEntities: {},
      fetchRules: () => {},
      t: () => {}
    };

    const wrapper = shallow(
      <Maintenance {...fakeProps} />
    );
  });
});
