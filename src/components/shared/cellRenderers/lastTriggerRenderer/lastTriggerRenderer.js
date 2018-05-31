// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from "react";

import { EMPTY_FIELD_VAL } from 'components/shared/pcsGrid/pcsGridConfig';
import { TimeRenderer } from '../timeRenderer/timeRenderer';
import { Indicator } from 'components/shared';

export class LastTriggerRenderer extends Component {
  render() {
    const { value } = this.props;
    return (
      value
        ? value.error ? EMPTY_FIELD_VAL : <TimeRenderer value={value.response} />
        : <Indicator pattern="bar" />
    );
  }
}
