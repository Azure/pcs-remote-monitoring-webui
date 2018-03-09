// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import DeviceGrid from './devicesGrid/devicesGrid';
import { Btn, RefreshBar } from 'components/shared';
import { DeviceDetails } from './flyouts';

import './devices.css';

const closedFlyoutState = {
  flyoutOpen: false,
  selectedDeviceId: undefined
};

export class Devices extends Component {

  constructor(props) {
    super(props);
    this.state = closedFlyoutState;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPending && nextProps.isPending !== this.props.isPending) {
      // If the grid data refreshes, hide the flyout and deselect soft selections
      this.setState(closedFlyoutState);
    }
  }

  changeDeviceGroup = () => {
    const { changeDeviceGroup, deviceGroups }  = this.props;
    changeDeviceGroup(deviceGroups[1].id);
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  onSoftSelectChange = ({ id }) => this.setState({
    flyoutOpen: true,
    selectedDeviceId: id
  });

  getSoftSelectId = ({ id }) => id;

  render() {
    const { t, devices, error, isPending, lastUpdated, entities, fetchDevices } = this.props;
    const gridProps = {
      rowData: isPending ? undefined : devices || [],
      onSoftSelectChange: this.onSoftSelectChange,
      softSelectId: this.state.selectedDeviceId,
      getSoftSelectId: this.getSoftSelectId,
    };
    return (
      <div className="devices-container">
        <RefreshBar refresh={fetchDevices} time={lastUpdated} isPending={isPending} t={t} />
        {
          !!error &&
          <span className="status">
            { t('errorFormat', { message: t(error.message, { message: error.errorMessage }) }) }
          </span>
        }
        { !error && <DeviceGrid {...gridProps} /> }
        <Btn onClick={this.changeDeviceGroup}>Refresh Device Groups</Btn>
        { this.state.flyoutOpen && <DeviceDetails onClose={this.closeFlyout} device={entities[this.state.selectedDeviceId]} /> }
      </div>
    );
  }
}
