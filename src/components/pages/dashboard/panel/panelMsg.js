// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

export const PanelMsg = ({ children, className }) => (
  <div className={joinClasses('panel-message', className)}>{ children }</div>
);
