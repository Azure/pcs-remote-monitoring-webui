// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import '../cellRenderer.scss';

export const RuleStatusRenderer = ({ value, context: { t } }) => (
  <div className={`pcs-renderer-cell ${value === 'Enabled' ? 'highlight' : ''}`}>
    <div className="pcs-renderer-text">
      { value }
    </div>
  </div>
);
