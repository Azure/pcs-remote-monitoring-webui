// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import '../cellRenderer.css';

export const IsSimulatedRenderer = ({ value, context: { t } }) => (
  <div className="pcs-renderer-cell highlight">
    <div className="pcs-renderer-text">
      { value ? t('devices.grid.yes') : t('devices.grid.no') }
    </div>
  </div>
);
