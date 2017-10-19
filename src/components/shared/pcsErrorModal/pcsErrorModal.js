// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import CloseSvg from '../../../assets/icons/Cancel.svg';
import ErrorAsteriskSvg from '../../../assets/icons/ErrorAsterisk.svg';

import './pcsErrorModal.css';

class PcsErrorModal extends Component {
  render() {
    return (
      <div className="pcs-error-modal-container">
        <span className="pcs-error-modal-close-btn">
          <img src={CloseSvg} alt="Modal close icon" />
        </span>
        <div className="pcs-error-modal-header">
          <img src={ErrorAsteriskSvg} alt="Error Asterisk" />
          { this.props.header }
        </div>
        <div className="pcs-error-modal-content">{ this.props.children }</div>
      </div>
    );
  }
}

export default PcsErrorModal;
