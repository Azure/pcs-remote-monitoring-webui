// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Config from '../../common/config';
import EventTopic, { Topics } from '../../common/eventtopic';
import Http from '../../common/httpClient';

import './deviceGroupEditor.css';

class DeviceGroupEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groupName: '',
            clauses: [
                { Key: '',  Operator: 'EQ', Value: '', Type: 'String' }
            ],
            message: ''
        };

        this.subscriptions = [];
    }

    componentWillUnmount() {
        EventTopic.unsubscribe(this.subscriptions);
    }

    onGroupNameChange = (event) => {
        this.setState({ groupName: event.target.value });
    }

    onNewClause = () => {
        this.state.clauses.push({ Key: '', Operator: 'EQ', Value: '', Type: 'String'})
        this.setState({clauses: this.state.clauses});
    }

    onDeleteClause = (index) => {
        if (this.state.clauses.length <= 1) {
            return;
        }
        this.state.clauses.splice(index, 1);
        this.setState({clauses: this.state.clauses});
    }

    onFieldNameChange = (event, index) => {
        var newClauses = this.state.clauses.slice();
        newClauses[index].Key = event.target.value;
        this.setState({clauses: newClauses});
    }

    onFieldValueChange = (event, index) => {
        var newClauses = this.state.clauses.slice();
        newClauses[index].Value = event.target.value;
        this.setState({clauses: newClauses});
    }

    onOperatorChange = (event, index) => {
        var newClauses = this.state.clauses.slice();
        newClauses[index].Operator = event.target.value;
        this.setState({clauses: newClauses});
    }

    onTypeChange = (event, index) => {
        var newClauses = this.state.clauses.slice();
        newClauses[index].Type = event.target.value;
        this.setState({clauses: newClauses});
    }

    cancel = () => {
        this.props.onClose();
    }

    save = () => {
        const valid = this.state.clauses.every((c) => c.Key.trim() !== '' && c.Value.trim() !== '');
        if (!valid) {
            this.setState({message: 'Incorrect filed name or value.'});
        } else {
            Http.post(Config.uiConfigApiUrl + '/api/v1/devicegroups/' + this.state.groupName, this.state.clauses)
                .then((data) => {
                    this.props.onClose();
                    EventTopic.publish(Topics.dashboard.deviceGroup.changed, null, this);
                }).catch((err) => {
                    this.setState({ message: 'Failed to save device group due to: ' + err.message });
                });
        }
    }

    render() {
        const operators = [
            { name: '=', value: 'EQ' },
            { name: '!=', value: 'NE' },
            { name: '<', value: 'LT' },
            { name: '<=', value: 'LE' },
            { name: '>', value: 'GT' },
            { name: '>=', value: 'GE' },
            { name: 'In', value: 'In' }
        ];
        const dataTypes = ['Number', 'String', 'Boolean'];
        const rows = this.state.clauses.map((c, i) => {
             return (
                <tr>
                    <td>
                        <input className="form-control"  style={{ width: "280px" }} type="text" value={c.Key} placeholder='twin name, e.g. tags.location' onChange={ (event) => this.onFieldNameChange(event, i) } />
                    </td>
                    <td>
                        <select key={i}  className="form-control" value={c.Operator} onChange={(event) => this.onOperatorChange(event, i) }>
                            {
                                operators.map((o) => <option value={o.value} >{o.name}</option> )
                            }
                        </select>
                    </td>
                    <td>
                        <input className="form-control" style={{ width: "280px" }} value={c.Value} onChange={ (event) => this.onFieldValueChange(event, i) }  />
                    </td>
                    <td>
                        <select key={i} className="form-control" value={c.Type} onChange={(event) => this.onTypeChange(event, i) }>
                            {
                            dataTypes.map((type) =>
                                <option value={type}>{type}</option>)
                            }
                        </select>
                    </td>
                    <td>
                        <button className="btn btn-default" style={{ marginLeft: "5px" }} title="Add" onClick={this.onNewClause}>+</button>
                        <button className="btn btn-default" style={{ marginLeft: "5px"}} title="Delete" onClick={() => this.onDeleteClause(i) }>-</button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="deviceGroupEditorTile">
                <div className= "deviceGroupEditorLabel">
                    <label>Group Name</label>
                    <input className="form-control" style={{ width: "500px" }} value={this.state.groupName} placeholder='An meaningful name, e.g. Factory1' onChange={this.onGroupNameChange} />
                </div>
                <div className="deviceGroupEditorTable">
                    <table>
                        <thead>
                            <tr><td>Field</td><td>Operator</td><td>Value</td><td>Type</td></tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
                <div className="deviceGroupEditorControls">
                    <p className="deviceGroupEditorWarning">{this.state.message}</p>
                    <button className="btn btn-default deviceGroupEditorButton" onClick={this.save}>Save</button>
                    <button className="btn btn-default deviceGroupEditorButton" style={{ marginRight:"10px" }} onClick={this.cancel}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default DeviceGroupEditor
