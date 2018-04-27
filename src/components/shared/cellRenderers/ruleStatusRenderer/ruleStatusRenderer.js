// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import '../cellRenderer.css';

export const RuleStatusRenderer = ({ value, context: { t } }) => (
  <div className={`pcs-renderer-cell ${value ? 'highlight' : ''}`}>
    <div className="pcs-renderer-text">
      { value ? t('rules.grid.enabled') : t('rules.grid.disabled') }
    </div>
  </div>
);
