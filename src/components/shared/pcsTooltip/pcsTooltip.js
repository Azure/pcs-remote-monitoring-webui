// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import TooltipSvg from '../../../assets/icons/Tooltip.svg';

import './pcsTooltip.css';

const PcsTooltip = ({ show, content }) =>
  show && <div className="pcs-tooltip-container">
    <img className="pcs-tooltip-icon" src={TooltipSvg} alt="Tooltip icon" />
    {content}
  </div>;

export default PcsTooltip;
