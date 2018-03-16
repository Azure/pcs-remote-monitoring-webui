// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { Svg } from 'components/shared';
import { svgs } from 'utilities';

export const DeviceIcon = ({ type }) => (
  <Svg path={svgs.devices[(type || "generic").toLowerCase()]} className="device-icon" />
);
