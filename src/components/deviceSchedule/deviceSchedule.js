// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import {Button, ControlLabel, FormControl, FormGroup, Radio} from "react-bootstrap";
import {formatDate, formatString, getRandomString, isFunction} from "../../common/utils";
import httpClient from "../../common/httpClient";
import Config from "../../common/config";
import lang from "../../common/lang";

import "./deviceSchedule.css";

const DeviceConifgRoute = 'Jobs';
const DefaultExecutionTime = 0;

class DeviceSchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            JobId: `${lang.DEVICES.CHANGEPROPERTYX}-${formatDate(Date())}-${getRandomString(4)}`,
            selectedMethod: 'Reboot'
        };
        this.methods = ['Reboot', 'Deprovision', 'InitiateFirmwareUpdate', 'FactoryReset'];
    }

    onJobIdChanged = (event) => {
        this.setState({JobId: event.target.value});
    };

    onSelect = (event) => {
        this.setState({selectedMethod: event.target.value})
    };

    onConfirm() {
        if (this.props.devices && this.props.devices.length) {
            let ids = this.props.devices.map(device => {
                return `'${device.DeviceId}'`
            });
            let queryCondition = `deviceId in [${ids.toString()}]`;
            let payload = {
                JobId: this.state.JobId,
                QueryCondition: queryCondition,
                MaxExecutionTimeInSeconds: DefaultExecutionTime,
                MethodParameter: {
                    Name: this.state.selectedMethod
                }
            };
            httpClient.post(
                Config.iotHubManagerApiUrl + DeviceConifgRoute,
                payload
            ).catch((err) => {
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
            <div className="deviceSchedule">
                <FormGroup>
                    <ControlLabel>{lang.DEVICES.TASKNAME}</ControlLabel>
                    <FormControl type="text" value={this.state.JobId} onChange={this.onJobIdChanged}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{lang.DEVICES.AVAILABLEACTIONS}</ControlLabel>
                    <FormControl componentClass="select" onChange={this.onSelect}>
                        {
                            this.methods.map((method) =>
                                <option key={method} value={method}>{method}</option>
                            )
                        }
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{lang.DEVICES.SELECTTIMELINE}</ControlLabel>
                    <Radio name="timeOption">{lang.DEVICES.NOW}</Radio>
                    <Radio name="timeOption">{lang.DEVICES.TIMEWINDOW}</Radio>
                    <FormControl type="datetime"/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{formatString(lang.DEVICES.CAUTION, deviceCount)}</ControlLabel>
                    <Button className="btnConfirm" onClick={() => this.onConfirm()}>{lang.DEVICES.CONFIRM}</Button>
                </FormGroup>
            </div>
        );
    }
}

export default DeviceSchedule;