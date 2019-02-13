// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

import './propertyGrid.scss';

export const PropertyRow = (props) => (
  <div className={joinClasses('row', props.className)}>{props.children}</div>
);

PropertyRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
