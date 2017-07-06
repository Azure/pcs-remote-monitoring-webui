// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../layouts/main/main';
import fetch from 'node-fetch';

window.fetch = fetch;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Main />, div);
});
