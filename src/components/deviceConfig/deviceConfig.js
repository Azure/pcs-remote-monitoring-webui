// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { Button, FormControl } from "react-bootstrap";
import { formatString } from "../../common/utils";
import lang from "../../common/lang";
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
                    <label>{lang.DEVICES.TASKNAME}</label>
                    <FormControl type="text" defaultValue="Change property X" />
                </div>
                <div className="marginTop20">
                    <label>{lang.DEVICES.CONFIGPROPERTIES}</label>
                    <DeviceProperty configProperties={configProperties} />
                </div>
                <div className="marginTop20">
                    <label>{formatString(lang.DEVICES.CAUTION, deviceCount)}</label>
                    <Button className="btnConfirm" onClick={() => this.onConfirm()}>{lang.DEVICES.CONFIRM}</Button>
                </div>
            </div>
        );
    }
}

export default DeviceConfig;
