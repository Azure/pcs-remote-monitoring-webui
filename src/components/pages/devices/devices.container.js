// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Devices } from './devices';
import {
  epics as devicesEpics,
  getDevices,
  getDevicesError,
  getDevicesLastUpdated,
  getDevicesPendingStatus
} from 'store/reducers/devicesReducer';
import { redux as appRedux, getDeviceGroups } from 'store/reducers/appReducer';

// Pass the devices status
const mapStateToProps = state => ({
  devices: getDevices(state),
  error: getDevicesError(state),
  isPending: getDevicesPendingStatus(state),
  deviceGroups: getDeviceGroups(state),
  lastUpdated: getDevicesLastUpdated(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchDevices: () => dispatch(devicesEpics.actions.fetchDevices()),
  changeDeviceGroup: (id) => dispatch(appRedux.actions.updateActiveDeviceGroup(id))
});

export const DevicesContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Devices));
