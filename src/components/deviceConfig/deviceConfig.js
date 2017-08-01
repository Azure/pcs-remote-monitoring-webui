// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import {Button} from "react-bootstrap";
import {formatString, isFunction} from "../../common/utils";
import * as uuid from "uuid/v4"
import lang from "../../common/lang";
import DeviceProperty from "../deviceProperty/deviceProperty";
import Config from "../../common/config";
import httpClient from "../../common/httpClient";

import "./deviceConfig.css";


const DeviceConfigRoute = 'Jobs';
const DefaultExecutionTime = 0;

class DeviceConfig extends React.Component {

    onConfirm() {
        if (this.props.devices && this.props.devices.length) {
            let ids = this.props.devices.map(device => {
                return `'${device.Twin.deviceId}'`
            });
            let queryCondition = `deviceId in [${ids.toString()}]`;
            let configTwin = {};
            this.refs.deviceProperty.getProperty().forEach(config => {
                configTwin[config.name] = config.value;
            });
            let payload = {
                JobId: uuid(),
                QueryCondition: queryCondition,
                MaxExecutionTimeInSeconds: DefaultExecutionTime,
                UpdateTwin: {
                    DesiredProperties: {
                        config: configTwin
                    }
                }
            };
            httpClient.post(
                Config.iotHubManagerApiUrl + DeviceConfigRoute,
                payload
            ).catch((err)=>{
                console.log(err);
            });
        }

        if (isFunction(this.props.finishCallback)) {
            this.props.finishCallback();
        }
    }

    render() {
        const deviceCount = this.props.devices && Array.isArray(this.props.devices) ? this.props.devices.length : 0;
        return (
            <div className="deviceConfig">
                <div className="marginTop20">
                    <label>{lang.DEVICES.CONFIGPROPERTIES}</label>
                    <DeviceProperty ref="deviceProperty" />
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
