// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import Config from 'app.config';
import { Svg } from 'components/shared/svg/svg';
import { svgs } from 'utilities';

import '../cellRenderer.scss';
import './severityRenderer.scss';

const getSvg = value => {
  if (value === Config.ruleSeverity.warning) return svgs.warning;
  if (value === Config.ruleSeverity.critical) return svgs.critical;
  return svgs.info;
};

export const SeverityRenderer = ({ value, context: { t }, iconOnly }) => {
  const cleanValue = (value || '').toLowerCase();
  const cellClasses = `pcs-renderer-cell severity ${cleanValue || ''} ${cleanValue ? 'highlight' : ''}`;
  return (
    <div className={cellClasses}>
      <Svg path={getSvg(cleanValue)} className="pcs-renderer-icon" />
      {
        !iconOnly &&
        <div className="pcs-renderer-text">
          {t(`rules.severity.${cleanValue}`)}
        </div>
      }
    </div>
  );
};

export default SeverityRenderer;
