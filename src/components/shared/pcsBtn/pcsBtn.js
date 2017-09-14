// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import './pcsBtn.css';

class PcsBtn extends Component {
  render() {
    const btnProps = { 
      ...this.props,
      className: `pcs-btn ${this.props.className || ''}`
    };
    // Remove invalid attributes before passing to the button tag
    delete btnProps.svg;
    delete btnProps.value;

    return (
      <button {...btnProps}>
        {this.props.svg && <img src={this.props.svg} className="pcs-btn-svg" alt={this.props.value} />}
        <span className="pcs-btn-value">{this.props.children || this.props.value}</span>
      </button>
    );
  }
}

export default PcsBtn;
