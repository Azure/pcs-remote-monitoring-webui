// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Select from 'react-select';

import './pcsSelect.css';

class PcsSelect extends Component {
  render() {
    const pcsSelectGridProps = {
      ...this.props,
      className: `pcs-select-container ${this.props.className ? this.props.className : ''}`
    };
    
    return (
      <Select {...pcsSelectGridProps} />
    );
  }
}

export default PcsSelect;
