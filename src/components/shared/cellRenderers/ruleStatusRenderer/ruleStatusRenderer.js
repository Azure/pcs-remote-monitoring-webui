// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { Svg } from 'components/shared/svg/svg';
import { svgs } from 'utilities';

import '../cellRenderer.css';

export const RuleStatusRenderer = ({ value, context: { t } }) => (
  <div className={`pcs-renderer-cell ${value ? 'highlight' : ''}`}>
    <Svg path={ value ? svgs.ruleEnabled : svgs.ruleDisabled } className="pcs-renderer-icon" />
    <div className="pcs-renderer-text uppercase">
      { value ? t('rules.grid.enabled') : t('rules.grid.disabled') }
    </div>
  </div>
);
