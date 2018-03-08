// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import {
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent
} from 'components/shared';

export class DeviceDetails extends Component {
  render() {
    const { onClose, device } = this.props;
    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>Device Details</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          <pre>{ JSON.stringify(device, null, 2) }</pre>
        </FlyoutContent>
      </Flyout>
    );
  }
}
