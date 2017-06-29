// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Http from '../../common/httpClient';
import Config from '../../common/config';

class NameInput extends React.Component {

    handleChange = (e) => {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <div className='form-group'>
                <span>Name</span>
                <input className="form-control" value={this.props.value} onChange={this.handleChange} />
            </div>
        );
    }
}

class DescInput extends React.Component {

    handleChange = (e) => {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <div className='form-group'>
                <span>Description</span>
                <textarea className="form-control" rows="2" value={this.props.value} onChange={this.handleChange} />
            </div>
        );
    }
}

export default class CustomInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ''
        };
    }

    componentDidMount() {
        this.getData().then((data) => {
            this.setState(data);
        }).catch((e) => {
            var message = "Failed to call loadData. " +  e.message;
            console.log(message);
        });
    }

    submit() {
        return this.saveData(this.state).then(() => {
            console.log("Succeeded to call saveData");
        }).catch((e) => {
            var message = "Failed to call saveData. " +  e.message;
            console.log(message);
            alert(message);
        });
    }

    handleNameChange = (name) => {
        this.setState({ name: name });
    }

    handleDescChange = (description) => {
        this.setState({ description: description });
    }

    getData() {
        return Http.get(Config.uiConfigApiUrl + "/api/v1/solution");
    }

    saveData(data) {
        return Http.post(Config.uiConfigApiUrl + "/api/v1/solution", data);
    }

    render() {
        return (
            <div>
                <NameInput value={this.state.name} onChange={this.handleNameChange} />
                <DescInput value={this.state.description} onChange={this.handleDescChange} />
            </div>
        );
    }
}

