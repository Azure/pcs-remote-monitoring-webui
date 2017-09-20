// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import lang from "../../../common/lang";

import SimulatedDeviceSvg from '../../../assets/icons/SimulatedDevice.svg';
import PhysicalDeviceSvg from '../../../assets/icons/PhysicalDevice.svg';

import '../cellRenderer.css'

class IsSimulatedRenderer extends React.Component {
  render() {
    const { value } = this.props;
    return (
      <div className="pcs-renderer-cell highlight">
        <img src={value ? SimulatedDeviceSvg : PhysicalDeviceSvg} className="pcs-renderer-icon" alt='Device Type Icon' />
        <div className="pcs-renderer-text">
          {value ? lang.YES : lang.NO}
        </div>
      </div>
    );
  }
}

export default IsSimulatedRenderer;
