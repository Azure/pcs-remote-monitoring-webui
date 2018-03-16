// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

import './propertyGrid.css';

export const PropertyHeaderCell = (props) => (
  <div className={joinClasses('cell cell-header', props.className)}>{props.children}</div>
);

PropertyHeaderCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
