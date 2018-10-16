// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { svgs } from 'utilities';
import { Svg } from 'components/shared/svg/svg';

import '../cellRenderer.css';

export const GlimmerRenderer = (props) => (
  props.value
    ? <Svg path={svgs.glimmer} className="glimmer-icon" />
    : null
);
