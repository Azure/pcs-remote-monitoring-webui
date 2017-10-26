// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import lang from '../../../common/lang';

import CloseSvg from '../../../assets/icons/Cancel.svg';
import ErrorAsteriskSvg from '../../../assets/icons/ErrorAsterisk.svg';

import './pcsErrorModal.css';

class PcsErrorModal extends Component {

  extractError(error) {
    if (typeof error === 'string') return error;
    const message = error.message || error.Message;
    return typeof message === 'string' ? message : lang.UNKNOWN_ERROR;
  }

  render() {
    const message = this.extractError(this.props.children);
    return (
      <div className="pcs-error-modal-container">
        <span className="pcs-error-modal-close-btn">
          <img src={CloseSvg} alt="Modal close icon" />
        </span>
        <div className="pcs-error-modal-header">
          <img src={ErrorAsteriskSvg} alt="Error Asterisk" />
          { this.props.header }
        </div>
        <div className="pcs-error-modal-content">{ message }</div>
      </div>
    );
  }
}

export default PcsErrorModal;
