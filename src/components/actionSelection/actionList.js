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


    closeFlyout = (name) => {
        if (this.refs[name]){
            this.refs[name].hide();
        }
    };

    render() {
        const configflyout =(
            <Flyout ref='configflyout'>
                <Header>
                    {lang.CHANGEDEVICECONFIG}
                </Header>
                <Body>
                    <DeviceConfig
                        devices={this.props.devices}
                        finishCallback={this.closeFlyout.bind(this,'configflyout')}/>
                </Body>
            </Flyout>
        );
        const organizeflyout =(
            <Flyout ref='organizeflyout'>
                <Header>
                    {lang.ORGANIZEMYDEVICE}
                </Header>
                <Body>
                    <DeviceOrganize
                        devices={this.props.devices}
                        finishCallback={this.closeFlyout.bind(this,'organizeflyout')}/>
                </Body>
            </Flyout>
        );
        const scheduleflyout =(
            <Flyout ref='scheduleflyout'>
                <Header>
                    {lang.SCHEDULEANACTION}
                </Header>
                <Body>
                    <DeviceSchedule
                        devices={this.props.devices}
                        finishCallback={this.closeFlyout.bind(this,'scheduleflyout')}/>
                </Body>
            </Flyout>
        );

        return (
            <Row>
                <ListGroup>
                    <ListGroupItem onClick={()=>{this.openFlyout('configflyout')}}>{lang.CHANGEDEVICECONFIG}</ListGroupItem>
                    <ListGroupItem onClick={()=>{this.openFlyout('organizeflyout')}}>{lang.ORGANIZEMYDEVICE}</ListGroupItem>
                    <ListGroupItem onClick={()=>{this.openFlyout('scheduleflyout')}}>{lang.SCHEDULEANACTION}</ListGroupItem>
                </ListGroup>
                {configflyout}
                {organizeflyout}
                {scheduleflyout}
            </Row>
        )
    }
}

export default ActionList;