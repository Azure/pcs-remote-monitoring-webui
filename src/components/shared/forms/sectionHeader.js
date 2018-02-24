// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

// This component has no style sheet.
// The styles are applied contextually by its parent.

export const SectionHeader = (props) => (
  <div className={joinClasses('section-header', props.className)}>{props.children}</div>
);

SectionHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
