// Copyright (c) Microsoft. All rights reserved.

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
          <PanelHeaderLabel>{t('examples.panel.header')}</PanelHeaderLabel>
        </PanelHeader>
        <PanelContent className="example-panel-container">
          {t('examples.panel.panelBody')}
        </PanelContent>
      </Panel>
    );
  }
}
