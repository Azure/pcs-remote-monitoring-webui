// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from "react";
import { EMPTY_FIELD_VAL } from 'components/shared/pcsGrid/pcsGridConfig';
import { Indicator } from 'components/shared';

export class CountRenderer extends Component {
  render() {
    const { value } = this.props;
    return (
      value
        ? value.error ? EMPTY_FIELD_VAL : value.response
        : <Indicator pattern="bar" />
    );
  }
}
