// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { Svg } from 'components/shared/svg/svg';
import { svgs } from 'utilities';

import '../cellRenderer.css';

export const IsSimulatedRenderer = ({ value, context: { t } }) => (
  <div className="pcs-renderer-cell highlight">
    { value ? <Svg path={svgs.simulatedDevice} className="pcs-renderer-icon" /> : null }
    <div className="pcs-renderer-text">
      { value ? t('devices.grid.yes') : t('devices.grid.no') }
    </div>
  </div>
);
