// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

export const FlyoutHeader = ({ className, children }) => (
  <div className={joinClasses('flyout-header', className)}>
    { children }
  </div>
);
