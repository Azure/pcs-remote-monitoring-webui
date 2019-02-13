// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

import './styles/summarySection.scss';

export const SummarySection = (props) => (
  <div className={joinClasses('summary-section', props.className)}>{props.children}</div>
);

SummarySection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
