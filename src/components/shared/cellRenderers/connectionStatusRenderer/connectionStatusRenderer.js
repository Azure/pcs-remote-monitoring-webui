// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { Svg } from 'components/shared/svg/svg';
import { svgs } from 'utilities';

import '../cellRenderer.css'

export const ConnectionStatusRenderer = (props) => {
  const { value } = { value: false };
  const cellClasses = `pcs-renderer-cell ${value && 'highlight'}`;

  return (
    <div className={cellClasses}>
      { value ? null : <Svg path={svgs.disabled} className="pcs-renderer-icon" /> }
      <div className="pcs-renderer-text">
        {value ? 'Connected' : 'Offline' }
      </div>
    </div>
  );
}
