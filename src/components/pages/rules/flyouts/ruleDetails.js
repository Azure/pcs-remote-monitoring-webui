// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import {
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent
} from 'components/shared';

export class RuleDetails extends Component {
  render() {
    const { onClose, rule } = this.props;
    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>Rule Details</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          <pre>{ JSON.stringify(rule, null, 2) }</pre>
        </FlyoutContent>
      </Flyout>
    );
  }
}
