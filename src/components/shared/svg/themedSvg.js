// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Svg } from 'components/shared';

export const ThemedSvg = ({ theme, paths, ...props } = {}) => <Svg path={(paths || {})[theme]} {...props} />;
