// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeviceNew } from './deviceNew';
import { redux as devicesRedux } from 'store/reducers/devicesReducer';

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  insertDevice: device => dispatch(devicesRedux.actions.insertDevice(device))
});

export const DeviceNewContainer = translate()(connect(null, mapDispatchToProps)(DeviceNew));
