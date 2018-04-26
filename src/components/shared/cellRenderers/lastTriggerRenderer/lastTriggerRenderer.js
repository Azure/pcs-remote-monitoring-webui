// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { EMPTY_FIELD_VAL } from 'components/shared/pcsGrid/pcsGridConfig';
import { TimeRenderer } from '../timeRenderer/timeRenderer';
import { Indicator } from 'components/shared';

export const LastTriggerRenderer = ({ value }) => (
  value
    ? value.error ? EMPTY_FIELD_VAL : <TimeRenderer value={value.response} />
    : <Indicator pattern="bar" />
);
