// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';
import { SelectInput } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Input/SelectInput';

const onChangeSelect = (onChange, name) => (value) => {
  onChange({ target: { name, value: { value } } });
}

export const Select = ({ className, onChange, name, options, placeholder, value, ...props }) => {
  if (!options) {
    options = [];
  }

  if (!options.some(x => x.value === value)) {
    // add a dummy placeholder option:
    options = options.slice(0); // create a shallow copy of the input options array
    options.push({
      value,
      label: placeholder || value,
      hidden: true,
      disabled: true
    });
  }

  return <SelectInput
    name={name}
    className={className}
    options={options}
    value={value}
    {...props}
    onChange={onChangeSelect(onChange, name)} />;
};

Select.propTypes = { className: PropTypes.string };
