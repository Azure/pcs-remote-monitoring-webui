// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Panel } from './panel';
import { PanelError } from './panelError';

export class PanelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError
      ? <Panel>
          <PanelError>{ this.props.msg }</PanelError>
        </Panel>
      : this.props.children
  }
}
