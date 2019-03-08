// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { Svg } from 'components/shared';
import { svgs, joinClasses } from 'utilities';

import './searchInput.scss';

export const SearchInput = ({ children, className, ...rest }) => (
  <div className={joinClasses('context-menu-search-input', className)}>
    <Svg path={svgs.search} className="search-icon"/>
    <input className="search-text-box" {...rest} type="text" />
  </div>
);
