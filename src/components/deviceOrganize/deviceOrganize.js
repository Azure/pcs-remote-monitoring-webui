// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import {Button, FormControl} from 'react-bootstrap'
import {formatDate, formatString, getRandomString, isFunction} from "../../common/utils";
import lang from "../../common/lang";
import DeviceProperty from "../deviceProperty/deviceProperty";

import "./deviceOrganize.css"
import Config from "../../common/config";
import httpClient from "../../common/httpClient";

const DeviceConifgRoute = 'Jobs';
const DefaultExecutionTime = 0;

class DeviceOrganize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            JobId: `${lang.DEVICES.CHANGEPROPERTYX}-${formatDate(Date())}-${getRandomString(4)}`,
        };
        this.configProperties = [
            { name: 'Building', value: 4.3, type: 'Number' },
            { name: 'Floor', value: 1, type: 'Number' },
            { name: 'Compus', value: 'Redmond', type: 'String' },
            { name: 'IsNew', value: true, type: 'Boolean' }
        ]

    }

    onConfirm() {
        if (this.props.devices && this.props.devices.length) {
            let ids = this.props.devices.map(device => {
                return `'${device.DeviceId}'`
            });
            let queryCondition = `deviceId in [${ids.toString()}]`;
            let tags = {};
            this.configProperties.forEach(config => {
                tags[config.name] = config.value;
            });
            let payload = {
                JobId: this.state.JobId,
                QueryCondition: queryCondition,
                MaxExecutionTimeInSeconds: DefaultExecutionTime,
                UpdateTwin: {
                    Tags: tags
                }
            };
            httpClient.post(
                Config.iotHubManagerApiUrl + DeviceConifgRoute,
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
            <div className="deviceOrganize">
                <div>
                    <label>{lang.DEVICES.TASKNAME}</label>
                    <FormControl type="text" value={this.state.JobId} onChange={this.onJobIdChanged}/>
                </div>
                <div>
                    <DeviceProperty configProperties={this.configProperties} />
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
