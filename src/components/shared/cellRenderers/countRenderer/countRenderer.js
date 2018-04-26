// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { EMPTY_FIELD_VAL } from 'components/shared/pcsGrid/pcsGridConfig';
import { Indicator } from 'components/shared';

export const CountRenderer = ({ value }) => (
  value
    ? value.error ? EMPTY_FIELD_VAL : value.response
    : <Indicator pattern="bar" />
);
