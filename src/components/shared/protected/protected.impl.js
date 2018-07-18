// Copyright (c) Microsoft. All rights reserved.

import { Component } from 'react';
import { isFunc } from 'utilities';

export class ProtectedImpl extends Component {
  userHasPermission() {
    const { permission, userPermissions } = this.props;
    return userPermissions.has(permission);
  }

  render() {
    const { children, permission } = this.props;
    const hasPermission = this.userHasPermission();
    if (isFunc(children)) {
      return children(hasPermission, permission);
    }
    return hasPermission ? children : null;
  }
};
