// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';

class SampleWgtRedux extends Component {

    handleClick = (msg) => {
        const { actions } = this.props;
        actions.showFlyout(msg);
    }

    render() {
        const messages = this.props.messages.map(msg => {
          return <div key={msg.DeviceId} onClick={() => this.handleClick(msg)}>
            <h4>{msg.DeviceId}</h4>
            <p>TIME: {msg.Time}</p>
            <p>BODY: {msg.Body}</p>
          </div>;
        });

        return (
            <div className="sampleWidgetWrapper">
                Hello, {this.props.title || "Sample Redux"}
                <div>{messages}</div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(SampleWgtRedux);
