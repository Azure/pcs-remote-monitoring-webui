// Copyright (c) Microsoft. All rights reserved.

import React from'react';

import { AccordionProvider } from './accordionProvider';
import { joinClasses } from 'utilities';

import './flyoutSection.css';

export const FlyoutSection = ({ collapsable, className, children }) => (
  <AccordionProvider isCollapsable={collapsable}>
    <div className={joinClasses('flyout-section', className)}>
      { children }
    </div>
  </AccordionProvider>
);
