// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import EventTopic, { Topics } from "../../common/eventtopic";

import './jsonViewer.css';

class JsonViewer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
        this.subscriptions = [];
    }

    componentDidMount() {
        this.subscriptions.push(EventTopic.subscribe(Topics.system.device.twin.opened, (topic, data, publisher) => {
            this.setState({data: data});
        }));
    }

    componentWilUnmount() {
        EventTopic.unsubscribe(this.subscriptions);
    }

    onCopy = (e) => {
        window.getSelection().removeAllRanges();
        const range = document.createRange();
        this.refs.content.focus();
        range.selectNode(this.refs.content);
        window.getSelection().addRange(range);
        document.execCommand('copy');
    }

    render() {
        return (
            <div className="jsonViewer-tile">
                <pre ref="content" className="jsonViewer-content">{JSON.stringify(this.state.data, null, '  ')}</pre>
                <div>
                    <button className="btn btn-default jsonViewer-button"  onClick={this.onCopy}>Copy</button>
                </div>
            </div>
        );
    }
}

export default JsonViewer;