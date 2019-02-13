// Copyright (c) Microsoft. All rights reserved.

// <panel>
import React, { Component } from 'react';

import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
} from 'components/pages/dashboard/panel';

import './examplePanel.scss';

export class ExamplePanel extends Component {
  constructor(props) {
    super(props);

    this.state = { isPending: true };
  }

  render() {
    const { t } = this.props;

    return (
      <Panel>
        <PanelHeader>
          <PanelHeaderLabel>{t('walkthrough.dashboard.panels.example.header')}</PanelHeaderLabel>
        </PanelHeader>
        <PanelContent className="example-panel-container">
          {t('walkthrough.dashboard.panels.example.panelBody')}
        </PanelContent>
      </Panel>
    );
  }
}
// </panel>
