// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { Svg } from 'components/shared/svg/svg';
import { joinClasses } from 'utilities';

import './styles/btn.css';

export const Btn = (props) => {
  const {svg, children, className, ...btnProps } = props;
  return (
    <button type="button" {...btnProps} className={joinClasses('btn', className)}>
      { props.svg && <Svg path={props.svg} className="btn-icon" /> }
      { props.children && <div className="btn-text">{props.children}</div> }
    </button>
  );
};

Btn.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  svg: PropTypes.string
};
