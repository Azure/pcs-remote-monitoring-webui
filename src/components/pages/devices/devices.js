// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Btn } from 'components/shared';

import './devices.css';

export class Devices extends Component {
  constructor(props) {
    super(props);
    this.props.fetchDevices();
  }

  renderDevices(devices, noDevicesMessage) {
    if (devices && devices.length) {
      return (
        <ul>
          {devices.map((device, index) => <li key={index} className="device">{device.id}</li>)}
        </ul>
      );
    }
    return noDevicesMessage;
  }

  render() {
    const { t, devices, error, fetchDevices } = this.props;
    return (
      <div className="devices-container">
        { this.renderDevices(devices, error ? error : t('devices.noneFound')) }
        <Btn onClick={fetchDevices}>{t('devices.refresh')}</Btn>
      </div>
    );
  }
}
