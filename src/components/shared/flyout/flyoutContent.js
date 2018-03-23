// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

export const FlyoutContent = ({ className, children }) => (
  <div className={joinClasses('flyout-content', className)}>
    { children }
  </div>
);
