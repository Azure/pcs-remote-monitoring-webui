// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeviceJobs } from './deviceJobs';
import { redux as devicesRedux } from 'store/reducers/devicesReducer';

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  updateTags: device => dispatch(devicesRedux.actions.updateTags(device))
});

export const DeviceJobsContainer = translate()(connect(null, mapDispatchToProps)(DeviceJobs));
