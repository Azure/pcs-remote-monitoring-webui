// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeviceNew } from './deviceNew';
import {
  epics as simulationEpics,
  getSimulationDeviceModelOptions
} from 'store/reducers/deviceSimulationReducer';
import {
  epics as devicesEpics,
  redux as devicesRedux
} from 'store/reducers/devicesReducer';

// Pass the global info needed
const mapStateToProps = state => ({
  deviceModelOptions: getSimulationDeviceModelOptions(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchDeviceModelOptions: () => dispatch(simulationEpics.actions.fetchSimulationDeviceModelOptions()),
  insertDevices: devices => dispatch(devicesRedux.actions.insertDevices(devices)),
  fetchDevices: () => dispatch(devicesEpics.actions.fetchDevices())
});

export const DeviceNewContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(DeviceNew));
