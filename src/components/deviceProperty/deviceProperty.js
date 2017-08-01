// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { FormControl } from "react-bootstrap";
import lang from '../../common/lang';

import del from "./delete.svg";
import add from "./add_black.svg";
import "./deviceProperty.css";

export default class DeviceProperty extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            configProperties: this.props.configProperties && this.props.configProperties.length
                ? this.props.configProperties
                :[{name:'', value:'', type:''}]
        };
    }

    onAdd() {
        this.state.configProperties.push({ name: '', value: '', type: '' });
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
        properties[index].name = event.target.value;
        this.setState({ configProperties: properties });
    }

    onFieldValueChange(event, index) {
        const properties = this.state.configProperties;
        properties[index].value = event.target.value;
        this.setState({ configProperties: properties });
    }

    onFieldTypeChange(event, index) {
        const properties = this.state.configProperties;
        properties[index].type = event.target.value;
        this.setState({ configProperties: properties });
    }

    getProperty() {
        return this.state.configProperties;
    }

    render() {
        const dataTypes = ['Number', 'String', 'Boolean'];
        return (
            <table className="deviceProperty">
                <thead>
                    <tr>
                        <td>{lang.DEVICES.PROPERTYNAME}</td>
                        <td>{lang.DEVICES.PROPERTYVALUE}</td>
                        <td>{lang.DEVICES.PROPERTYTYPE}</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.configProperties.map((p, i) =>
                            <tr key={i}>
                                <td><FormControl type="text" value={p.name} onChange={(event) => this.onFieldNameChange(event, i)} /></td>
                                <td><FormControl type="text" value={p.value} onChange={(event) => this.onFieldValueChange(event, i)} /></td>
                                <td>
                                    <FormControl componentClass="select" value={p.type} onChange={(event) => this.onFieldTypeChange(event, i)}>
                                        {dataTypes.map((type) => {
                                            return <option key={type} value={type}>{type}</option>
                                        })}
                                    </FormControl>

                                </td>
                                <td><span className="operation" title={lang.DEVICES.DELETE} onClick={() => this.onDelete(i)}><img alt={lang.DEVICES.DELETE} src={del} /></span></td>
                            </tr>
                        )
                    }
                    <tr><td></td><td></td><td></td><td><span className="operation" title={lang.DEVICES.ADD} onClick={() => this.onAdd()}><img alt={lang.DEVICES.ADD} src={add} /></span></td></tr>
                </tbody>
            </table>
        );
    }
}


