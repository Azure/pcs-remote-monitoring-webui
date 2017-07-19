// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";
import EventTopic from "../../common/eventtopic.js";
import Flyout, {Body, Header} from "../../framework/flyout/flyout";
import ActionList from "../actionSelection/actionList";

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

    onClick = () => {
        this.refs.flyout.show();
    };

    render() {
        const flyout =(
            <Flyout ref='flyout'>
                <Header>
                    Provision devices
                </Header>
                <Body>
                    <ActionList/>
                </Body>
            </Flyout>
        );

        if (!this.state.deviceCount) {
            return (
                <div>
                    <button type="button"
                            className="btn btn-default btn-block"
                            onClick={()=>{this.onClick()}}>{this.state.buttonText}
                    </button>
                    {flyout}
                </div>
            )
        } else {
            return (
                <div>
                    <button type="button" className="btn btn-default btn-block"
                            onClick={()=>{this.onClick()}}>
                        {this.state.buttonText}{' (' + this.props.deviceCount + ')'}
                    </button>
                    {flyout}
                </div>
            );
        }
    }
}

export default ActOnDevice;