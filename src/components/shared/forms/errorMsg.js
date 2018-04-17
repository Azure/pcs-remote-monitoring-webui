// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { Svg } from 'components/shared/svg/svg';
import { joinClasses, svgs } from 'utilities';

import './styles/errorMsg.css';

export const ErrorMsg = (props) => {
  const { children, className } = props;
  return (
    <div className={joinClasses('error-message', className)}>
      <Svg path={svgs.error} className="error-icon" />
      { children }
    </div>
  );
};

ErrorMsg.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
