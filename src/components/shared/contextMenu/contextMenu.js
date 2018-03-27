// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './contextMenu.css';

export const ContextMenu = ({ children, className }) => (
  <div className={joinClasses('context-menu-container', className)}>{ children }</div>
);
