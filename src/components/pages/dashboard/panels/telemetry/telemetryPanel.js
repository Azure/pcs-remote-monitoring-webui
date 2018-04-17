// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import 'tsiclient';

import { Indicator } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay,
  PanelError
} from 'components/pages/dashboard/panel';

import { TelemetryChart } from './telemetryChart';

import './telemetryPanel.css';

export class TelemetryPanel extends Component {
  render() {
    const { t, isPending, telemetry, colors, error } = this.props;
    const showOverlay = isPending && !Object.keys(telemetry).length;
    return (
      <Panel>
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.telemetry.header')}</PanelHeaderLabel>
          { !showOverlay && isPending && <Indicator size="small" /> }
        </PanelHeader>
        <PanelContent className="telemetry-panel-container">
          <TelemetryChart telemetry={telemetry} colors={colors} />
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
        { error && <PanelError>{ t('errorFormat', { message: t(error.message, { message: error.errorMessage }) }) }</PanelError> }
      </Panel>
    );
  }
}
