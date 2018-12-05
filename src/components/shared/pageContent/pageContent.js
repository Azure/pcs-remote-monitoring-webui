// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './pageContent.scss';

/** A presentational component containing the content for a page */
export const PageContent = ({ className, children }) => (
  <div className={joinClasses('page-content-container', className)}>
    {children}
  </div>
);
