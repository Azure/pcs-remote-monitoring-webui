// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { DeviceDelete } from './deviceDelete';
import { redux as deviceRedux } from 'store/reducers/devicesReducer';

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  deleteDevices: deviceIds => dispatch(deviceRedux.actions.deleteDevices(deviceIds))
});

export const DeviceDeleteContainer = withNamespaces()(connect(null, mapDispatchToProps)(DeviceDelete));
