// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

import './propertyGrid.css';

export const PropertyGridBody = (props) => (
  <div className={joinClasses('grid-scrollable', props.className)}>{props.children}</div>
);

PropertyGridBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
