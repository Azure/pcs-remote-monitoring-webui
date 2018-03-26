// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Indicator } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay,
  PanelError
} from 'components/pages/dashboard/panel';

export class MapPanel extends Component {
  render() {
    const { t, isPending, error } = this.props;
    const showOverlay = isPending;
    return (
      <Panel className="map-panel-container">
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.map.header')}</PanelHeaderLabel>
          { !showOverlay && isPending && <Indicator size="small" /> }
        </PanelHeader>
        <PanelContent>
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
        { error && <PanelError>{t(error.message)}</PanelError> }
      </Panel>
    );
  }
}
