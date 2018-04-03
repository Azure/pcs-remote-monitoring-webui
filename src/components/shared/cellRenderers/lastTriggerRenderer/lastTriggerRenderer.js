// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { TimeRenderer } from '../timeRenderer/timeRenderer';
import { Indicator } from 'components/shared';

export const LastTriggerRenderer = props => props.value ? <TimeRenderer {...props} /> : <Indicator pattern="bar" />;
