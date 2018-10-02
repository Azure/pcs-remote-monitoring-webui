// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { DeploymentDetails } from './deploymentDetails';

describe('Deployment details Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      t: () => { },
      match: { params: { id: 'testId' } },
      fetchDeployment: () => { },
      deleteItem: () => { },
      currentDeployment: {}
    };

    const wrapper = shallow(
      <DeploymentDetails {...fakeProps} />
    );
  });
});
