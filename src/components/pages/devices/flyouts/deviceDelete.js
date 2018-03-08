// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import {
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent
} from 'components/shared';

export class DeviceDelete extends Component {
  render() {
    const { onClose } = this.props;
    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>Delete</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          Delete
        </FlyoutContent>
      </Flyout>
    );
  }
}
