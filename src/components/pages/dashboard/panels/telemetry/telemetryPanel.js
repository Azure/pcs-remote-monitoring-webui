// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import 'tsiclient';

import { AjaxError, Hyperlink, Indicator } from 'components/shared';
import {
  Panel,
  PanelContent,
  PanelError,
  PanelHeader,
  PanelHeaderLabel,
  PanelMsg,
  PanelOverlay
} from 'components/pages/dashboard/panel';

import { TelemetryChart } from './telemetryChart';

import './telemetryPanel.css';

export class TelemetryPanel extends Component {
  render() {
    const { t, isPending, telemetry, lastRefreshed, theme, colors, error, timeSeriesExplorerUrl } = this.props;
    const showOverlay = isPending && !lastRefreshed;
    return (
      <Panel>
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.telemetry.header')}</PanelHeaderLabel>
          { !showOverlay && isPending && <Indicator size="small" /> }
        </PanelHeader>
        <PanelContent className="telemetry-panel-container">
          {
            timeSeriesExplorerUrl &&
              <Hyperlink className="time-series-explorer" href={timeSeriesExplorerUrl} target="_blank">{t('dashboard.panels.telemetry.exploreTimeSeries')}</Hyperlink>
          }
          <TelemetryChart telemetry={telemetry} theme={theme} colors={colors} />
          {
            !showOverlay && Object.keys(telemetry).length === 0
              && <PanelMsg>{t('dashboard.noData')}</PanelMsg>
          }
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
        { error && <PanelError><AjaxError t={t} error={error} /></PanelError> }
      </Panel>
    );
  }
}
