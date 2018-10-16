// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';
import './statPropertyPair.css';

/** A presentational component containing statistics value, label and icon */
export const StatPropertyPair = ({ label, value, className }) => {
  return (
    <div className={joinClasses('stat-property-pair', className)}>
      <div className={'stat-property-pair-label'}>{label}</div>
      <div className="stat-property-pair-value">{value}</div>
    </div >
  );
}
