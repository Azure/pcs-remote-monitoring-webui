// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Flyout, { Header, Body } from '../../framework/flyout/flyout';
import { Button } from 'react-bootstrap';
import DeviceConfig from '../deviceConfig/deviceConfig';

class ChangeDeviceConfig extends Component {
    onClick = () => {
        this.refs.flyout.show();
    }

    confirmCallback = () => {
        this.refs.flyout.hide();
    }

    render() {
        return (
            <div>
                <Flyout ref='flyout'>
                    <Header>
                        change devices config
                     </Header>
                    <Body>
                        <DeviceConfig finishCallback={this.confirmCallback} />
                    </Body>
                </Flyout>
            </div>
        );
    }
}

export default ChangeDeviceConfig;