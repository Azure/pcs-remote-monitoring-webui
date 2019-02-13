// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { DeviceJobs } from './deviceJobs';
import { redux as devicesRedux } from 'store/reducers/devicesReducer';
import { epics as appEpics} from 'store/reducers/appReducer';

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  updateTags: device => dispatch(devicesRedux.actions.updateTags(device)),
  updateProperties: device => dispatch(devicesRedux.actions.updateProperties(device)),
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const DeviceJobsContainer = withNamespaces()(connect(null, mapDispatchToProps)(DeviceJobs));
