
// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Config from '../../common/config';
import Http from '../../common/httpClient';
import './alarmCounter.css'

class AlarmCounter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title || '',
            url: this.props.url,
            color: this.props.color,
            backgroundColor: this.props.backgroundColor,
            fontSize: this.props.fontSize,
            value: '',
        };
    }

    componentDidMount() {
        this.getCount();
    }

    getCount() {
        if (this.state.url) {
            Http.get(`${Config.solutionApiUrl}${this.state.url}`).then((data) => {
                this.setState({ value: data });
            })
        }
    }

    render() {
        return (
            <div className="alarmCounter">
                <div className="alarmCounterTitle"><label>{this.state.title}</label></div>
                <div className="alarmCounterContent" style={{ color: this.state.color, backgroundColor: this.state.backgroundColor, fontSize: this.state.fontSize }}>{this.state.value}</div>
            </div>
        );
    }
}

export default AlarmCounter;
