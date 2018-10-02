// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { mount } from 'enzyme';
import 'polyfills';

import Shell from 'components/shell/shell';

describe('Shell integration test', () => {
  it('Render Shell component', () => {

    const fakeProps = {
      theme: 'dark',
      deviceGroupFlyoutIsOpen: () => { },
      registerRouteEvent: () => { },
      logout: () => { },
      t: () => { },
      history : {
        listen : () => {}
      }
    };

    const wrapper = mount(
      <Shell {...fakeProps} />
    );
  });
});
