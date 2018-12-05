// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

import './styles/formSection.scss';

export const FormSection = (props) => (
  <div className={joinClasses('form-section', props.className)}>{props.children}</div>
);

FormSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
