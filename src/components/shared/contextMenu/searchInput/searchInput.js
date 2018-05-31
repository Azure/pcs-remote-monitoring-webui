// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './searchInput.css';

export const SearchInput = ({ children, className, ...rest }) => (
  <input {...rest} type="text" className={joinClasses('context-menu-search-input', className)} />
);
