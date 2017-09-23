// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import InfoSvg from '../../../assets/icons/Info.svg';
import WarningSvg from '../../../assets/icons/Warning.svg';
import CriticalSvg from '../../../assets/icons/Critical.svg';

import './severityCellRenderer.css'

class SeverityCellRenderer extends React.Component {
  render() {
    const { value } = this.props;
    const cellClasses = `pcs-renderer-cell ${value && 'highlight'}`;

    let svg = InfoSvg;
    if (value.toLowerCase() === 'warning') {
        svg = WarningSvg;
    } else if (value.toLowerCase() === 'critical') {
        svg = CriticalSvg;
    }

    return (
      <div className={cellClasses}>
        <img src={svg} className="pcs-renderer-icon severity-icon" alt='Connection Status Icon' />
        <div className="pcs-renderer-text">
          {value}
        </div>
      </div>
    );
  }
}

export default SeverityCellRenderer;
