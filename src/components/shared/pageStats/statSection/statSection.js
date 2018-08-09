// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './statSection.css';

/** A presentational component containing one or many StatGroup */
export const StatSection = ({ children, className }) => (
  <div className={joinClasses('stat-container', className)}>{children}</div>
);
