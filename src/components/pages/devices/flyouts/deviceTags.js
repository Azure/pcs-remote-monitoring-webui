// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import {
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent
} from 'components/shared';

export class DeviceTags extends Component {
  render() {
    const { onClose } = this.props;
    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>Tag</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          Tags
        </FlyoutContent>
      </Flyout>
    );
  }
}
