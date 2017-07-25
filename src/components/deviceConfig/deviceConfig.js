// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { Button, FormControl } from "react-bootstrap";
import DeviceProperty from "../deviceProperty/deviceProperty";
import "./deviceConfig.css";

class DeviceConfig extends React.Component {
    onConfirm() {
        if (typeof this.props.finishCallback === "function") {
            this.props.finishCallback();
        }
    }

    render() {
        const deviceCount = this.props.devices && Array.isArray(this.props.devices) ? this.props.devices.length : 0;
        const configProperties = [
            { name: 'TelemetryInterval', value: 15, type: 'Number' },
            { name: 'TemperatureMeanValue', value: 70.0, type: 'Number' }
        ];
        return (
            <div className="deviceConfig">
                <div>
                    <label>Task Name</label>
                    <FormControl type="text" defaultValue="Change property X" />
                </div>
                <div className="marginTop20">
                    <label>Config Properties (properties.desired.config.*)</label>
                    <DeviceProperty configProperties={configProperties} />
                </div>
                <div className="marginTop20">
                    <label>Caution: You are scheduling an action that will affect {deviceCount} devices.</label>
                    <Button className="btnConfirm" onClick={() => this.onConfirm()}>Confirm</Button>
                </div>
            </div>
        );
    }
}

export default DeviceConfig;
