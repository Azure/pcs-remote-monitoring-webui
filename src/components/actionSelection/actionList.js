// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";
import Flyout, {Body, Header} from "../../framework/flyout/flyout";
import {ListGroup, ListGroupItem, Row} from 'react-bootstrap';
import DeviceConfig from '../deviceConfig/deviceConfig'
import DeviceOrganize from '../deviceOrganize/deviceOrganize'
import DeviceSchedule from '../deviceSchedule/deviceSchedule'
import lang from '../../common/lang'

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
                    {lang.DEVICES.CHANGEDEVICECONFIG}
                </Header>
                <Body>
                    <DeviceConfig devices={this.props.devices}/>
                </Body>
            </Flyout>
        );
        const organizeflyout =(
            <Flyout ref='organizeflyout'>
                <Header>
                    {lang.DEVICES.ORGANIZEMYDEVICE}
                </Header>
                <Body>
                    <DeviceOrganize devices={this.props.devices}/>
                </Body>
            </Flyout>
        );
        const scheduleflyout =(
            <Flyout ref='scheduleflyout'>
                <Header>
                    {lang.DEVICES.SCHEDULEANACTION}
                </Header>
                <Body>
                    <DeviceSchedule devices={this.props.devices}/>
                </Body>
            </Flyout>
        );

        return (
            <Row>
                <ListGroup>
                    <ListGroupItem onClick={()=>{this.openFlyout('configflyout')}}>{lang.DEVICES.CHANGEDEVICECONFIG}</ListGroupItem>
                    <ListGroupItem onClick={()=>{this.openFlyout('organizeflyout')}}>{lang.DEVICES.ORGANIZEMYDEVICE}</ListGroupItem>
                    <ListGroupItem onClick={()=>{this.openFlyout('scheduleflyout')}}>{lang.DEVICES.SCHEDULEANACTION}</ListGroupItem>
                </ListGroup>
                {configflyout}
                {organizeflyout}
                {scheduleflyout}
            </Row>
        )
    }
}

export default ActionList;