// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import InfoSvg from '../../../assets/icons/Info.svg';
import WarningSvg from '../../../assets/icons/Warning.svg';
import CriticalSvg from '../../../assets/icons/Critical.svg';

import '../cellRenderer.css'
import './severityCellRenderer.css'

class SeverityCellRenderer extends React.Component {
  render() {
    const value = this.props.value.toLowerCase();
    const cellClasses = `pcs-renderer-cell severity ${value && 'highlight'}`;

    let svg = InfoSvg;
    if (value === 'warning') {
        svg = WarningSvg;
    } else if (value === 'critical') {
        svg = CriticalSvg;
    }

    return (
      <div className={cellClasses}>
        <img src={svg} className="pcs-renderer-icon" alt='Connection Status Icon' />
        <div className="pcs-renderer-text">
          {value}
        </div>
      </div>
    );
  }
}

export default SeverityCellRenderer;
