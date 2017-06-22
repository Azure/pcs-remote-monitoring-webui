// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from '../components/layout/wrapper/wrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Wrapper />, div);
});
