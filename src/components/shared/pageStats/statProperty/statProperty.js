// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';
import { Svg } from 'components/shared';
import './statProperty.css';

const validSizes = new Set(['large', 'medium', 'small', 'normal']);

/** A presentational component containing statistics value, label and icon */
export const StatProperty = ({ value, label, size, svg, className, svgClassName }) => {
  const sizeClass = validSizes.has(size) ? size : 'normal';
  return (
    <div className={joinClasses('stat-property', className)}>
      {svg && <Svg path={svg} className={joinClasses('stat-icon', svgClassName)} />}
      <div className={joinClasses('stat-value', sizeClass)}>{value}</div>
      <div className="stat-label">{label}</div>
    </div >
  );
}
