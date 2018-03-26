// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { PanelOverlay } from './panelOverlay';
import { joinClasses } from 'utilities';

export const PanelError = ({ children, className }) => (
  <PanelOverlay className="error-overlay">
    <div className={joinClasses('panel-error-container', className)}>
      { children }
    </div>
  </PanelOverlay>
);
