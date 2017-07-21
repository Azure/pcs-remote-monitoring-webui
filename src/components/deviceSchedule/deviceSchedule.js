// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { FormControl, Radio, Button, ControlLabel, FormGroup } from 'react-bootstrap';

import "./deviceSchedule.css"

class DeviceSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [],
        };
        this.methods = ['Reboot', 'Deprovision', 'InitiateFirmwareUpdate', 'FactoryReset'];
    }

    onConfirm() {
        if (typeof this.props.finishCallback === "function") {
            this.props.finishCallback();
        }
    }

    render() {
        return (
            <div className="deviceSchedule">
                <FormGroup>
                    <ControlLabel>Available actions</ControlLabel>
                    <FormControl componentClass="select">
                        {
                            this.methods.map((method) =>
                                <option value={method}>{method}</option>
                            )
                        }
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Select timeline</ControlLabel>
                    <Radio name="timeOption" >Now</Radio>
                    <Radio name="timeOption">Time window</Radio>
                    <FormControl type="datetime" />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Caution: You are scheduling an action that will effect {this.state.devices.length} devices.</ControlLabel>
                    <Button className="btnConfirm" onClick={() => this.onConfirm()}>Confirm</Button>
                </FormGroup>
            </div>
        );
    }
}

export default DeviceSchedule;