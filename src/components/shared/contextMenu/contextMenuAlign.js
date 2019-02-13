// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './contextMenu.scss';

export const ContextMenuAlign = ({ children, className, left }) => (
  <div className={joinClasses('context-menu-align-container', className, left ? 'left' : 'right')}>{ children }</div>
);
