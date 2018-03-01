// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Devices } from './devices';
import {
  epics as devicesEpics,
  getDevices,
  getDevicesError
} from 'store/reducers/devicesReducer';


// Pass the devices status
const mapStateToProps = state => ({
  devices: getDevices(state),
  error: getDevicesError(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchDevices: () => dispatch(devicesEpics.actions.fetchDevices()),
});

export const DevicesContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Devices));
