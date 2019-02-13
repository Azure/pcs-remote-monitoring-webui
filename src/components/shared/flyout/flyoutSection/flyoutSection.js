// Copyright (c) Microsoft. All rights reserved.

import React from'react';

import { AccordionProvider } from './accordionProvider';
import { joinClasses } from 'utilities';

import './flyoutSection.scss';

export const FlyoutSection = ({ collapsable, className, children, closed }) => (
  <AccordionProvider isCollapsable={collapsable} isClosed={closed}>
    <div className={joinClasses('flyout-section', className)}>
      { children }
    </div>
  </AccordionProvider>
);
