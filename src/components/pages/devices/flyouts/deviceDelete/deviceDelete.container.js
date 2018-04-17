// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeviceDelete } from './deviceDelete';
import { redux as deviceRedux } from 'store/reducers/devicesReducer';

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  deleteDevice: deviceId => dispatch(deviceRedux.actions.deleteDevice(deviceId))
});

export const DeviceDeleteContainer = translate()(connect(null, mapDispatchToProps)(DeviceDelete));
