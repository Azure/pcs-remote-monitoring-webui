// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

export const PanelContent = ({ children, className }) => (
  <div className={joinClasses('panel-content', className)}>{ children }</div>
);
