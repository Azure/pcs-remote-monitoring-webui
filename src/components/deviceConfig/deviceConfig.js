// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import EventTopic, { Topics } from '../../common/eventtopic';
import { FormControl, Button } from 'react-bootstrap';
import del from './delete.svg';
import add from './add_black.svg';
import "./deviceConfig.css"

class DeviceConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            configProperties: [
                { name: 'TelemetryInterval', value: 15 },
                { name: 'TemperatureMeanValue', value: 70.0 }
            ],
        };
    }

    componentDidMount() {
        EventTopic.subscribe(Topics.device.configAction, (topic, data, publisher) => {
            this.setState({ devices: data });
        });
    }

    onAdd() {
        this.state.configProperties.push({ name: '', value: '' });
        this.setState({ configProperties: this.state.configProperties })
    }

    onDelete(index) {
        setTimeout(() => {
            this.state.configProperties.splice(index, 1);
            this.setState({ configProperties: this.state.configProperties });
        }, 0)
    }

    onFieldNameChange(event, index) {
        const properties = this.state.configProperties;
        properties[index] = event.target.value
        this.setState({ configProperties: properties });
    }

    onFieldValueChange(event, index) {
        const properties = this.state.configProperties;
        properties[index] = event.target.value
        this.setState({ configProperties: properties });
    }

    onConfirm() {
        if (typeof this.props.finishCallback === "function") {
            this.props.finishCallback();
        }
    }

    render() {
        return (
            <div className="deviceConfig">
                <div>
                    <label>Task Name</label>
                    <FormControl type="text" value="Change property X" />
                </div>
                <div className="marginTop20">
                    <label>Config Properties (properties.desired.config.*)</label>
                    <table>
                        <tr>
                            <td>Name</td>
                            <td>Value</td>
                        </tr>
                        <tbody>
                            {
                                this.state.configProperties.map((p, i) =>
                                    <tr>
                                        <td><FormControl type="text" value={p.name} onChange={(event) => this.onFieldNameChange(event, i)} /></td>
                                        <td><FormControl type="text" value={p.value} onChange={(event) => this.onFieldValueChange(event, i)} /></td>
                                        <td><span title="Remove" onClick={() => this.onDelete(i)}><img alt="Remove" src={del} /></span></td>
                                    </tr>
                                )
                            }
                            <tr><td></td><td></td><td><span title="Add" onClick={() => this.onAdd()}><img alt="Add" src={add} /></span></td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="marginTop20">
                    <label>Caution: You are scheduling an action that will affect {this.state.devices.length} devices.</label>
                    <Button className="btnConfirm" onClick={() => this.onConfirm()}>Confirm</Button>
                </div>
            </div>
        );
    }
}

export default DeviceConfig;
