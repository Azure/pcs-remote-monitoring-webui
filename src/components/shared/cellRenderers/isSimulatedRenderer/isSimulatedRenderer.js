// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { Svg } from 'components/shared/svg/svg';
import { svgs } from 'utilities';

import '../cellRenderer.css'

export const IsSimulatedRenderer = ({ value, context: { t } }) => (
  <div className="pcs-renderer-cell highlight">
    <Svg path={ value ? svgs.simulatedDevice : svgs.physicalDevice } className="pcs-renderer-icon" />
    <div className="pcs-renderer-text uppercase">
      { value ? t('devices.grid.yes') : t('devices.grid.no') }
    </div>
  </div>
);
