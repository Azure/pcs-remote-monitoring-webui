// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import DeviceGrid from './devicesGrid/devicesGrid';
import { Btn } from 'components/shared';

import './devices.css';

export class Devices extends Component {
  constructor(props) {
    super(props);
    this.props.fetchDevices();
  }

  render() {
    const { t, devices, error, isPending, fetchDevices } = this.props;
    return (
      <div className="devices-container">
        { !!error && <span className="status">Error: {error.errorMessage}</span> }
        { !error && <DeviceGrid rowData={isPending ? undefined : devices || []} /> }
        <Btn onClick={fetchDevices}>{t('devices.refresh')}</Btn>
      </div>
    );
  }
}
