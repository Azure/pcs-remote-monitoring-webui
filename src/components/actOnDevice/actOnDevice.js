// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";
import Flyout, {Body, Header} from "../../framework/flyout/flyout";
import {Button} from 'react-bootstrap';
import ActionList from "../actionSelection/actionList";

class ActOnDevice extends Component {

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
        const hasDevice = this.props.devices && this.props.devices.length > 0;
        const count = hasDevice ? ' (' + this.props.devices.length + ')' : null;

        return (
            <div>
                <Button disabled={!hasDevice} onClick={this.onClick}>
                    {this.props.buttonText || "..."}{count}
                </Button>
                {flyout}
            </div>
        );
    }
}

export default ActOnDevice;