// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './contextMenu.scss';

export const ContextMenu = ({ children, className }) => (
  <div className={joinClasses('context-menu-container', className)}>{ children }</div>
);
