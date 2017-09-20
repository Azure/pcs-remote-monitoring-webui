// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from "react";
import Flyout, { Body, Header } from "../../framework/flyout/flyout";
import ActionList from "../actionSelection/actionList";
import lang from "../../common/lang";
import PcsBtn from '../shared/pcsBtn/pcsBtn';

import './actOnDevice.css';

class ActOnDevice extends Component {

  onClick = () => {
    this.refs.flyout.show();
  };

  render() {
    const flyout = (
      <Flyout ref='flyout'>
        <Header>
          {lang.ACTONDEVICES}
        </Header>
        <Body>
          <ActionList devices={this.props.devices} />
        </Body>
      </Flyout>
    );
    const hasDevice = this.props.devices && this.props.devices.length > 0;
    const count = hasDevice ? ' (' + this.props.devices.length + ')' : '';

    return (
      <div className="act-on-device-container">
        <PcsBtn disabled={!hasDevice} onClick={this.onClick} value={`${this.props.buttonText || '...'} ${count}`} />
        {flyout}
      </div>
    );
  }
}

export default ActOnDevice;