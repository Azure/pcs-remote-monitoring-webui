// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

export const PanelHeader = ({ children, className }) => (
  <div className={joinClasses('panel-header', className)}>{ children }</div>
);
