// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Select } from 'components/shared';
import { isFunc } from 'utilities';

import './timeIntervalDropdown.css';

const optionValues = [
  { value: 'PT1H' },
  { value: 'P1D' },
  { value: 'P7D' },
  { value: 'P1M' },
];

export class TimeIntervalDropdown extends Component {

  onChange = (propOnChange) => ({ target: { value: { value } = {} } = {} }) => {
    this.setState({ selected: value });
    if (isFunc(propOnChange)) propOnChange(value);
  }

  render() {
    const options = optionValues.map(({ value }) => ({
      label: this.props.t(`timeInterval.${value}`),
      value
    }));

    return (
      <Select
        className="time-interval-dropdown"
        options={options}
        value={this.props.value}
        searchable={false}
        clearable={false}
        onChange={this.onChange(this.props.onChange)} />
    );
  }
}
