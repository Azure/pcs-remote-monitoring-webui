// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { Btn } from 'components/shared';

import './styles/pill.css';

export const Pill = ({ svg, label, onSvgClick, altSvgText }) => (
    <div className="pill">
      { label }
      { svg && <Btn onClick={onSvgClick} svg={svg} className="pill-icon" alt={altSvgText}/> }
    </div>
  );

Pill.propTypes = {
  svg: PropTypes.string,
  label: PropTypes.string,
  onSvgClick: PropTypes.func,
  altSvgText: PropTypes.string
};
