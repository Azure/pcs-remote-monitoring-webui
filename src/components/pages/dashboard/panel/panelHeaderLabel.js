// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

export const PanelHeaderLabel = ({ children, className }) => (
  <h2 className={joinClasses('panel-header-label', className)}>{ children }</h2>
);
