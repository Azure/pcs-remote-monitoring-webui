// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

export const PanelOverlay = ({ children, className }) => (
  <div className={joinClasses('panel-overlay-container', className)}>{ children }</div>
);
