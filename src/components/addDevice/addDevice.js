
// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Flyout, { Header, Body } from '../../framework/flyout/flyout';
import { Button } from 'react-bootstrap';
import DeviceProvisioningWorkflow from '../deviceProvisioningWorkflow/deviceProvisioningWorkflow';
import lang from '../../common/lang';

class AddDevice extends Component {
    onClick = () => {
        this.refs.flyout.show();
    }

    addDeviceCallback = () => {
        this.refs.flyout.hide();
    }

    render() {
        return (
            <div className="addDevice">
                <Button style={{ width: '10em' }} onClick={this.onClick}>{lang.DEVICES.ADDDEVICES}</Button>
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
