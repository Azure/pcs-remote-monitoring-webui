// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { Indicator } from 'components/shared';

export const CountRenderer = ({ value }) => (
  value ? value : <Indicator pattern="bar" />
);
