// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { NavLink } from 'react-router-dom';

import { Svg } from 'components/shared/svg/svg';
import { svgs } from 'utilities';

import '../cellRenderer.scss';

export const LinkRenderer = ({ to, svgPath, ariaLabel, onLinkClick }) => {
  return (
    <div className="pcs-renderer-cell">
      <NavLink to={to} aria-label={ariaLabel} className="pcs-renderer-link">
        <Svg path={svgPath || svgs.ellipsis} onClick={onLinkClick} />
      </NavLink>
    </div>
  );
};

export default LinkRenderer;
