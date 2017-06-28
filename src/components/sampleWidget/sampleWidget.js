// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Flyout, { Header, Body, Footer } from '../../framework/flyout/flyout';
import { Button } from 'react-bootstrap';
import EventTopic from '../../common/eventtopic';

import './sampleWidget.css';

class SampleWidget extends Component {

    componentDidMount() {
        this.subscriptions = [];
        this.subscriptions.push(EventTopic.subscribe("test", function (topic, data, sender) {

        }));
    }

    componentWillUnmount() {
        EventTopic.unsubscribe(this.subscriptions);
    }

    handleClick = () => {
        this.refs.flyout.show();
        EventTopic.publish("test", { data: "hello" }, this);
    }

    render() {
        return (
            <div className="sampleWidget" onClick={this.handleClick}>
                Hello, {this.props.title || "Sample"}
                <Flyout ref="flyout">
                    <Header>
                        Panel Title
                    </Header>
                    <Body>
                        Content
                    </Body>
                    <Footer>
                        <Button bsStyle="primary">Apply</Button>
                    </Footer>
                </Flyout>
            </div>
        );
    }
}

export default SampleWidget;