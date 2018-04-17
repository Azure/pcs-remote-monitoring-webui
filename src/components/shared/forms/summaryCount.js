// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

export const SummaryCount = (props) => (
  <div className={joinClasses('summary-count', props.className)}>{props.children}</div>
);

SummaryCount.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
