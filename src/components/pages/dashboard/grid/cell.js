// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './grid.scss';

export const Cell = ({ className, children }) => (
  <div className={joinClasses('grid-cell', className)}>
    <div className="grid-cell-contents">
      { children }
    </div>
  </div>
);
