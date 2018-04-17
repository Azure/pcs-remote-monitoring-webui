// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

import { joinClasses } from 'utilities';

import './styles/select.css';

const onChangeSelect = (onChange, name) => (value) => onChange({ target: { name, value } });

export const Select = ({ className, onChange, name, ...props }) => {
  return <ReactSelect
    className={joinClasses('select-container', className)}
    {...props}
    onChange={onChangeSelect(onChange, name)} />;
};

Select.propTypes = { className: PropTypes.string };
