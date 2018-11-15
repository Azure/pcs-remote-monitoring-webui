// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Trans } from 'react-i18next';
import 'tsiclient';

import Config from 'app.config';
import { themedPaths } from 'utilities';
import { AjaxError, Hyperlink, Indicator, ThemedSvgContainer, Tooltip } from 'components/shared';
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
          {!showOverlay && isPending && <Indicator size="small" />}
        </PanelHeader>
        <PanelContent className="telemetry-panel-container">
          {
            timeSeriesExplorerUrl &&
            <div className="time-series-explorer">
              <Hyperlink href={timeSeriesExplorerUrl} target="_blank">{t('dashboard.panels.telemetry.exploreTimeSeries')}</Hyperlink>
              <Tooltip position="bottom" content={
                <Trans i18nKey={'dashboard.panels.telemetry.exploreTimeSeriesTooltip'}>
                  To view in TSI, get permissions from the solution owner.
                  <Hyperlink href={Config.contextHelpUrls.exploreTimeSeries} target="_blank">{t('dashboard.panels.telemetry.learnMore')}</Hyperlink>
                </Trans>
              }>
                <ThemedSvgContainer paths={themedPaths.questionBubble} />
              </Tooltip>
            </div>
          }
          <TelemetryChart telemetry={telemetry} theme={theme} colors={colors} />
          {
            !showOverlay && Object.keys(telemetry).length === 0
            && <PanelMsg>{t('dashboard.noData')}</PanelMsg>
          }
        </PanelContent>
        {showOverlay && <PanelOverlay><Indicator /></PanelOverlay>}
        {error && <PanelError><AjaxError t={t} error={error} /></PanelError>}
      </Panel>
    );
  }
}
