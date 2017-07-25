// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";
import Flyout, {Body, Header} from "../../framework/flyout/flyout";
import {ListGroup, ListGroupItem, Row} from 'react-bootstrap';
import DeviceConfig from '../deviceConfig/deviceConfig'
import DeviceOrganize from '../deviceOrganize/deviceOrganize'
import DeviceSchedule from '../deviceSchedule/deviceSchedule'

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
                    <DeviceConfig devices={this.props.devices}/>
                </Body>
            </Flyout>
        );
        const organizeflyout =(
            <Flyout ref='organizeflyout'>
                <Header>
                    Organize my devices
                </Header>
                <Body>
                    <DeviceOrganize devices={this.props.devices}/>
                </Body>
            </Flyout>
        );
        const scheduleflyout =(
            <Flyout ref='scheduleflyout'>
                <Header>
                    Schedule an action
                </Header>
                <Body>
                    <DeviceSchedule devices={this.props.devices}/>
                </Body>
            </Flyout>
        );

        return (
            <Row>
                <ListGroup>
                    <ListGroupItem onClick={()=>{this.openFlyout('configflyout')}}>Change device configuration</ListGroupItem>
                    <ListGroupItem onClick={()=>{this.openFlyout('organizeflyout')}}>Organize my devices</ListGroupItem>
                    <ListGroupItem onClick={()=>{this.openFlyout('scheduleflyout')}}>Schedule an action</ListGroupItem>
                </ListGroup>
                {configflyout}
                {organizeflyout}
                {scheduleflyout}
            </Row>
        )
    }
}

export default ActionList;