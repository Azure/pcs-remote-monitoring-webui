// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Flyout, { Header, Body, Footer } from '../../framework/flyout/flyout';
import { Button } from 'react-bootstrap';
import CustomInfo from '../customInfo/customInfo';
import CustomLogo from '../customLogo/customLogo';

class CustomFlyout extends Component {

    show() {
        this.refs.flyout.show();
    }

    applyHandler = () => {
        const task1 = this.refs.customInfo.submit();
        const task2 = this.refs.customLogo.submit();
        Promise.all([task1, task2]).then(() => {
            this.refs.flyout.hide();
        });
    }

    cancelHandler = () => {
        this.refs.flyout.hide();
    }

    render() {
        return (
            <Flyout ref="flyout">
                <Header>
                    Customize Your Solution
                </Header>
                <Body>
                    <CustomInfo ref="customInfo"/>
                    <CustomLogo ref="customLogo"/>
                </Body>
                <Footer>
                    <Button onClick={this.cancelHandler}>Cancel</Button>&nbsp;
                    <Button bsStyle="primary" onClick={this.applyHandler}>Apply</Button>
                </Footer>
            </Flyout>
        );
    }
}

export default CustomFlyout;