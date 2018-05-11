// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

export const SummaryBody = (props) => (
  <div className={joinClasses('summary-body', props.className)}>{props.children}</div>
);

SummaryBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
