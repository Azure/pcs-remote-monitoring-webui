// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { SelectInput } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Input/SelectInput';

import { toDiagnosticsModel } from 'services/models';

import './deviceGroupDropdown.scss';

export class DeviceGroupDropdown extends Component {

  onChange = (deviceGroupIds) => ({ target: { value: { value } = {} } = {} }) => {
    this.props.logEvent(toDiagnosticsModel('DeviceGroupFilter_Select', {}));
    // Don't try to update the device group if the device id doesn't exist
    if (deviceGroupIds.indexOf(value) > -1) {
      this.props.changeDeviceGroup(value);
    }
    this.props.logEvent(toDiagnosticsModel('DeviceFilter_Select', {}));
  }

  deviceGroupsToOptions = deviceGroups => deviceGroups
    .map(({ id, displayName }) => ({ label: displayName, value: id }));

  render() {
    const { deviceGroups, activeDeviceGroupId } = this.props;
    const deviceGroupIds = deviceGroups.map(({ id }) => id);
    return (
      <SelectInput
        name="device-group-dropdown"
        className="device-group-dropdown"
        attr={{
          select: {
            className: "device-group-dropdown-select",
            'aria-label': this.props.t(`deviceGroupDropDown.ariaLabel`)
          },
          chevron: {
            className: "device-group-dropdown-chevron",
          },
        }}
        options={this.deviceGroupsToOptions(deviceGroups)}
        value={activeDeviceGroupId}
        onChange={this.onChange(deviceGroupIds)} />
    );
  }
}
