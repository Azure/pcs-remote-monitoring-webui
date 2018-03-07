// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import DeviceGrid from './devicesGrid/devicesGrid';
import { Btn, RefreshBar } from 'components/shared';

import './devices.css';

export class Devices extends Component {

  changeDeviceGroup = () => {
    const { changeDeviceGroup, deviceGroups }  = this.props;
    changeDeviceGroup(deviceGroups[1].id);
  }

  render() {
    const { t, devices, error, isPending, lastUpdated, fetchDevices } = this.props;
    return (
      <div className="devices-container">
        <RefreshBar refresh={fetchDevices} time={lastUpdated} isPending={isPending} />
        { !!error && <span className="status">{t('errorFormat', { message: error.message })}</span> }
        { !error && <DeviceGrid rowData={isPending ? undefined : devices || []} /> }
        <Btn onClick={this.changeDeviceGroup}>Refresh Device Groups</Btn>
      </div>
    );
  }
}
