// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

export const FlyoutTitle = ({ className, children }) => (
  <div className={joinClasses('flyout-title', className)}>
    { children }
  </div>
);
