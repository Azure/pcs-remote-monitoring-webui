// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './pageTitle.scss';

/** A presentational component containing the title for a page */
export const PageTitle = ({ titleValue, className }) => (
  <h1 className={joinClasses('page-title', className)}>{titleValue}</h1>
);
