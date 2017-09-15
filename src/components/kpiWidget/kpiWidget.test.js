// Copyright (c) Microsoft. All rights reserved.

import MockedConfig from '../../mock/config';
import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'node-fetch';
import { shallow } from 'enzyme';
import Http from '../../common/httpClient';

window.fetch = fetch;

it('renders without crashing', () => {});
