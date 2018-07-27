// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { mount } from 'enzyme';
import 'polyfills';

import AppContainer from 'components/app/app.container';
import MockApp from 'components/mocks/mockApp';

describe('App integration test', () => {
  let wrapper;
  it('Render App component', () => {
    wrapper = mount(
      <MockApp>
        <AppContainer />
      </MockApp>
    );
  });

});
