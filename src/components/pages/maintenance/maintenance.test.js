// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { MaintenanceContainer } from './maintenance.container';

describe('Dashboard Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      rulesEntities: {},
      rulesError: undefined,
      rulesIsPending: false,
      rulesLastUpdated: undefined,
      deviceEntities: {},
      fetchRules: () => {},
      t: () => {},
      updateCurrentWindow: () => {},
      logEvent: () => {}
    };

    const wrapper = shallow(
      <MaintenanceContainer {...fakeProps} />
    );
  });
});
