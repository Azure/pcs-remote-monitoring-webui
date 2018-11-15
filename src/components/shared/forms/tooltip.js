// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './styles/tooltip.css';

export const Tooltip = (props) => {
  const { content, children, position } = props;

  return (
    <div className="tooltip-container">
      <div className={joinClasses('tooltip', position)}>
        <div className="tooltip-content">
          {content}
        </div>
        <div className="tooltip-arrow" />
      </div>
      {children}
    </div>
  );
}
