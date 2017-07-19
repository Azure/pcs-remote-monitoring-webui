// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";
import Flyout, {Body, Header} from "../../framework/flyout/flyout";
import {ListGroup, ListGroupItem, Row} from 'react-bootstrap';

class ActionList extends Component {

    componentWillReceiveProps(nextProps) {
        this.setState({buttonText: nextProps.buttonText || '...'});
    }


    openFlyout = (name) => {
        if (this.refs[name]){
            this.refs[name].show();
        }
    };

    render() {
        const configflyout =(
            <Flyout ref='configflyout'>
                <Header>
                    Change device configuration
                </Header>
                <Body>
                Change device configuration
                </Body>
            </Flyout>
        );
        const organizeflyout =(
            <Flyout ref='organizeflyout'>
                <Header>
                    Organize my devices
                </Header>
                <Body>
                Organize my devices
                </Body>
            </Flyout>
        );
        const scheduleflyout =(
            <Flyout ref='scheduleflyout'>
                <Header>
                    Schedule an action
                </Header>
                <Body>
                Organize my devices
                </Body>
            </Flyout>
        );

        return (
            <Row>
                <ListGroup>
                    <ListGroupItem href="#" onClick={()=>{this.openFlyout('configflyout')}}>Change device configuration</ListGroupItem>
                    <ListGroupItem href="#" onClick={()=>{this.openFlyout('organizeflyout')}}>Organize my devices</ListGroupItem>
                    <ListGroupItem href="#" onClick={()=>{this.openFlyout('scheduleflyout')}}>Schedule an action</ListGroupItem>
                </ListGroup>
                {configflyout}
                {organizeflyout}
                {scheduleflyout}
            </Row>
        )
    }
}

export default ActionList;