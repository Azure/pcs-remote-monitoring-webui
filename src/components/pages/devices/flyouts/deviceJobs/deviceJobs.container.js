// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeviceJobs } from './deviceJobs';

// TODO: Map stuff in. Focusing on UI scaffolding for now. Will most likely need this when server calls are added.
export const DeviceJobsContainer = translate()(connect(null, null)(DeviceJobs));
