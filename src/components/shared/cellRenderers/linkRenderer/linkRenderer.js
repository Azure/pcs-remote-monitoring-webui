// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { NavLink } from 'react-router-dom';

import { Svg } from 'components/shared/svg/svg';
import { svgs } from 'utilities';

import '../cellRenderer.css';

export const LinkRenderer = ({ to, svgPath }) => {
  return (
    <div className="pcs-renderer-cell">
      <NavLink to={to} className="pcs-renderer-link">
        <Svg path={svgPath || svgs.ellipsis} />
      </NavLink>
    </div>
  );
};

export default LinkRenderer;
