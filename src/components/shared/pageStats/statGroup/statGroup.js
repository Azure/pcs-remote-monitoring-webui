// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './statGroup.scss';

/** A presentational component containing one or many StatProperty */
export const StatGroup = ({ children, className }) => (
  <div className={joinClasses('stat-cell', className)}>{children}</div>
);
