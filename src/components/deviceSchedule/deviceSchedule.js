// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { FormControl, Radio, Button, ControlLabel, FormGroup } from 'react-bootstrap';
import {formatString} from "../../common/utils";
import lang from "../../common/lang";

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
        const deviceCount = this.props.devices && Array.isArray(this.props.devices) ? this.props.devices.length : 0;
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
                    <ControlLabel>{formatString(lang.DEVICES.CAUTION, deviceCount)}</ControlLabel>
                    <Button className="btnConfirm" onClick={() => this.onConfirm()}>Confirm</Button>
                </FormGroup>
            </div>
        );
    }
}

export default DeviceSchedule;