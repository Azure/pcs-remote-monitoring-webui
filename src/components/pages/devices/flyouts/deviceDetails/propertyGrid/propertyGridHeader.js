// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

import './propertyGrid.css';

export const PropertyGridHeader = (props) => (
  <div className={joinClasses('grid-header', props.className)}>{props.children}</div>
);

PropertyGridHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
