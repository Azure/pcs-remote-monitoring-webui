// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import {Button, FormControl} from "react-bootstrap";
import {formatDate, formatString, getRandomString, isFunction} from "../../common/utils";
import lang from "../../common/lang";
import DeviceProperty from "../deviceProperty/deviceProperty";
import Config from "../../common/config";
import httpClient from "../../common/httpClient";

import "./deviceConfig.css";


const DeviceConfigRoute = 'Jobs';
const DefaultExecutionTime = 0;

class DeviceConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            JobId: `${lang.DEVICES.CHANGEPROPERTYX}-${formatDate(Date())}-${getRandomString(4)}`,
        };
        this.configProperties = [
            {name: 'TelemetryInterval', value: 15, type: 'Number'},
            {name: 'TemperatureMeanValue', value: 70.0, type: 'Number'}
        ]
    }

    onConfirm() {
        if (this.props.devices && this.props.devices.length) {
            let ids = this.props.devices.map(device => {
                return `'${device.DeviceId}'`
            });
            let queryCondition = `deviceId in [${ids.toString()}]`;
            let configTwin = {};
            this.configProperties.forEach(config => {
                configTwin[config.name] = config.value;
            });
            let payload = {
                JobId: this.state.JobId,
                QueryCondition: queryCondition,
                MaxExecutionTimeInSeconds: DefaultExecutionTime,
                UpdateTwin: {
                    DesiredProperties: {
                        conifg: configTwin
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

    onJobIdChanged = (event) => {
        this.setState({JobId: event.target.value});
    };

    render() {
        const deviceCount = this.props.devices && Array.isArray(this.props.devices) ? this.props.devices.length : 0;
        return (
            <div className="deviceConfig">
                <div>
                    <label>{lang.DEVICES.TASKNAME}</label>
                    <FormControl type="text" value={this.state.JobId} onChange={this.onJobIdChanged}/>
                </div>
                <div className="marginTop20">
                    <label>{lang.DEVICES.CONFIGPROPERTIES}</label>
                    <DeviceProperty configProperties={this.configProperties}/>
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
