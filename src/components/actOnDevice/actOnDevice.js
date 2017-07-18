// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";
import EventTopic from "../../common/eventtopic.js";

class ActOnDevice extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buttonText1: this.props.buttonText || "...",
            devices: [],
        };

        this.tokens = [];
    }

    componentWillReceiveProps(nextProps) {
        this.setState({buttonText: nextProps.buttonText || '...'});
    }

    componentDidMount() {
        if (this.props.topics) {
            for (let interestingTopic of this.props.topics) {
                this.tokens.push(EventTopic.subscribe(interestingTopic.name, (topic, data) => {
                    this.onEvent(topic, data);
                }));
            }
        }
    }

    onEvent = (topic, data) => {
        this.setState({devices: data});
    };

    render() {
        if (!this.state.deviceCount) {
            return (
                <button type="button" className="btn btn-default btn-block"
                        onClick={this.props.onClick}>{this.state.buttonText}</button>
            );
        } else {
            return (
                <button type="button" className="btn btn-default btn-block"
                        onClick={this.props.onClick}>{this.state.buttonText}{' (' + this.props.deviceCount + ')'}</button>
            );
        }

    }
}

export default ActOnDevice;