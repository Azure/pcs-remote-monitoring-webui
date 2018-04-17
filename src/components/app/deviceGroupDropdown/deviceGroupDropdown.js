// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Select } from 'components/shared';
import { compareByProperty } from 'utilities';

import './deviceGroupDropdown.css';

const allDevicesId = 'default_AllDevices';

export class DeviceGroupDropdown extends Component {

  onChange = (deviceGroupIds) => ({ target: { value: { value } = {} } = {} }) => {
    // Don't try to update the device group if the device id doesn't exist
    if (deviceGroupIds.indexOf(value) > -1) {
      this.props.changeDeviceGroup(value === allDevicesId ? undefined : value);
    }
  }

  deviceGroupsToOptions = deviceGroups => deviceGroups
    .map(({ id, displayName }) => ({ label: displayName, value: id }))
    .sort(compareByProperty('label', true));

  render() {
    const { deviceGroups, activeDeviceGroupId } = this.props;
    const deviceGroupIds = deviceGroups.map(({ id }) => id);
    return (
      <Select
        className="device-group-dropdown"
        options={this.deviceGroupsToOptions(deviceGroups)}
        value={activeDeviceGroupId || allDevicesId}
        clearable={false}
        onChange={this.onChange(deviceGroupIds)} />
    );
  }
}
