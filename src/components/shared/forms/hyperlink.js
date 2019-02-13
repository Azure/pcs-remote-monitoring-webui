// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';

export const Hyperlink = (props) => {
  const { children, className, href } = props;

  if (!href) return null;
  return (
    <a {...props} className={joinClasses('link', className)} >
      {children}
    </a>
  );
};

Hyperlink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.string
};
