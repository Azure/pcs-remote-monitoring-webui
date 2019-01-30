// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { SelectInput } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Input/SelectInput';

import { isFunc } from 'utilities';
import { toDiagnosticsModel } from 'services/models';

import './timeIntervalDropdown.scss';

const optionValues = [
  { value: 'PT1H' },
  { value: 'P1D' },
  { value: 'P7D' },
  { value: 'P1M' },
];

export class TimeIntervalDropdown extends Component {

  onChange = (propOnChange) => ({ target: { value: { value } = {} } = {} }) => {
    this.props.logEvent(toDiagnosticsModel('TimeFilter_Select', {}));
    if (isFunc(propOnChange)) propOnChange(value);
  }

  render() {
    const options = optionValues.map(({ value }) => ({
      label: this.props.t(`timeInterval.${value}`),
      value
    }));
    return (
      <SelectInput
        name="time-interval-dropdown"
        className="time-interval-dropdown"
        attr={{
          select: {
            className: 'time-interval-dropdown-select',
          },
          chevron: {
            className: 'time-interval-dropdown-chevron',
          },
        }}
        options={options}
        value={this.props.value}
        onChange={this.onChange(this.props.onChange)} />
    );
  }
}
