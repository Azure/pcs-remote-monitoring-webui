// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import {
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent
} from 'components/shared';

export class DeviceNew extends Component {
  render() {
    const { onClose } = this.props;
    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>New Device</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          New Device
        </FlyoutContent>
      </Flyout>
    );
  }
}
