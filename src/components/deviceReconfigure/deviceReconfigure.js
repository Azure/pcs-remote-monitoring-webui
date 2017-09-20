// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../actions/actionTypes';
import Reconfigure from '../../assets/icons/Reconfigure.svg';
import lang from '../../common/lang';
import './deviceReconfigure.css';

class DeviceReconfigure extends Component {
  render() {
    return (
      <div className="reconfigure-container" onClick={this.props.onDeviceTagClick}>
        <img className="reconfigure-icon" src={Reconfigure} alt="Reconfigure" />
        <span className="reconfigure">
          {lang.RECONFIGURE}
        </span>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onDeviceTagClick: () => {
    dispatch({
      type: actionTypes.FLYOUT_SHOW,
      content: {
        type: 'Reconfigure'
      }
    });
  }
});

export default connect(null, mapDispatchToProps)(DeviceReconfigure);
