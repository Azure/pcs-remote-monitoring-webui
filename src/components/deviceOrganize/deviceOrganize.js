// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Button } from 'react-bootstrap'
import { formatString } from "../../common/utils";
import lang from "../../common/lang";
import DeviceProperty from "../deviceProperty/deviceProperty";

import "./deviceOrganize.css"

class DeviceOrganize extends React.Component {
    onConfirm() {
        if (typeof this.props.finishCallback === "function") {
            this.props.finishCallback();
        }
    }

    render() {
        const deviceCount = this.props.devices && Array.isArray(this.props.devices) ? this.props.devices.length : 0;
        const configProperties = [
            { name: 'Building', value: 4.3, type: 'Number' },
            { name: 'Floor', value: 1, type: 'Number' },
            { name: 'Compus', value: 'Redmond', type: 'String' },
            { name: 'IsNew', value: true, type: 'Boolean' }
        ]
        return (
            <div className="deviceOrganize">
                <div>
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

export default DeviceOrganize;
