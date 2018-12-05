// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { DeviceJobs } from './deviceJobs';
import { redux as devicesRedux } from 'store/reducers/devicesReducer';

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  updateTags: device => dispatch(devicesRedux.actions.updateTags(device)),
  updateProperties: device => dispatch(devicesRedux.actions.updateProperties(device))
});

export const DeviceJobsContainer = withNamespaces()(connect(null, mapDispatchToProps)(DeviceJobs));
