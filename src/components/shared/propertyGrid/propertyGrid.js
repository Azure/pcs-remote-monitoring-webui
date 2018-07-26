// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

import './propertyGrid.css';

export const PropertyGrid = (props) => (
  <div className={joinClasses('property-grid-container', props.className)}>{props.children}</div>
);

PropertyGrid.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
