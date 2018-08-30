// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { mount } from 'enzyme';
import 'polyfills';

import ShellContainer from 'components/shell/shell.container';
import MockApp from 'components/mocks/mockApp';

describe('Shell integration test', () => {
  let wrapper;
  it('Render Shell component', () => {
    wrapper = mount(
      <MockApp>
        <ShellContainer />
      </MockApp>
    );
  });

});
