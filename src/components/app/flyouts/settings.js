// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import {
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent
} from 'components/shared';

export class Settings extends Component {
  render() {
    const { onClose } = this.props;
    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>Settings</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          Settings
        </FlyoutContent>
      </Flyout>
    );
  }
}
