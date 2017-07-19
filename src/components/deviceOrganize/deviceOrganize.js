// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import del from './delete.svg'
import add from './add_black.svg'
import "./deviceOrganize.css"

class DeviceOrganize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            configProperties: [
                { name: 'Building', value: 4.3, type: 'Number' },
                { name: 'Floor', value: 1, type: 'Number' },
                { name: 'Compus', value: 'Redmond', type: 'String' },
                { name: 'IsNew', value: true, type: 'Boolean' },
            ],
        };
        this.dataTypes = ['Number', 'String', 'Boolean'];
    }

    onAdd() {
        this.state.configProperties.push({ name: '', value: '', type: 'string' });
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
            <div className="deviceOrganize">
                <div>
                    <table>
                        <tr>
                            <td><label>Name</label></td>
                            <td><label>Value</label></td>
                            <td><label>Type</label></td>
                            <td></td>
                        </tr>
                        <tbody>
                            {
                                this.state.configProperties.map((p, i) =>
                                    <tr>
                                        <td><FormControl type="text" value={p.name} onChange={(event) => this.onFieldNameChange(event, i)} /></td>
                                        <td><FormControl type="text" value={p.value} onChange={(event) => this.onFieldValueChange(event, i)} /></td>
                                        <td>
                                            <FormControl componentClass="select" value={p.type}>
                                                {this.dataTypes.map((type) => {
                                                    return <option value={type}>{type}</option>
                                                })}
                                            </FormControl>

                                        </td>
                                        <td><span className="operation" title="Remove" onClick={() => this.onDelete(i)}><img src={del} /></span></td>
                                    </tr>
                                )
                            }
                            <tr><td></td><td></td><td></td><td><span className="operation" title="Add" onClick={() => this.onAdd()}><img src={add} /></span></td></tr>
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

export default DeviceOrganize;
