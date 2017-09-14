
// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Flyout, { Header, Body } from '../../framework/flyout/flyout';
import DeviceProvisioningWorkflow from '../deviceProvisioningWorkflow/deviceProvisioningWorkflow';
import lang from '../../common/lang';
import PcsBtn from '../shared/pcsBtn/pcsBtn';

import './addDevice.css';

class AddDevice extends Component {
  onClick = () => {
    this.refs.flyout.show();
  }

  addDeviceCallback = () => {
    this.refs.flyout.hide();
  }

  render() {
    return (
      <div className="add-device-container">
        <PcsBtn onClick={this.onClick} value={lang.DEVICES.ADDDEVICES} />
        <Flyout ref='flyout'>
          <Header>
            {lang.DEVICES.PROVISIONDEVICES}
          </Header>
          <Body>
            <DeviceProvisioningWorkflow finishCallback={this.addDeviceCallback} />
          </Body>
        </Flyout>
      </div>
    );
  }
}

export default AddDevice;
