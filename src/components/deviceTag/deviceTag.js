// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../actions/actionTypes';
import Tag from '../../assets/icons/Tag.svg';
import lang from '../../common/lang';
import './deviceTag.css';

class DeviceTag extends Component {
  render() {
    return (
      <div className="add-device">
        <div onClick={this.props.onDeviceTagClick}>
          <img className="tag-icon" src={Tag} alt="Tag" />
          <span className="tag-name">
            {lang.DEVICE_DETAIL.TAG}
          </span>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onDeviceTagClick: () => {
    dispatch({
      type: actionTypes.FLYOUT_SHOW,
      content: { type: 'Tag' }
    });
  }
});

export default connect(null, mapDispatchToProps)(DeviceTag);
