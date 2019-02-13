// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import {
  AjaxError,
  Indicator,
  StatGroup,
  StatProperty
} from 'components/shared';
import { svgs, renderUndefined, isDef } from 'utilities';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay,
  PanelError
} from 'components/pages/dashboard/panel';

import './overviewPanel.scss';

export class OverviewPanel extends Component {
  constructor(props) {
    super(props);

    this.state = { isPending: true };
  }

  render() {
    const {
      t,
      error,
      isPending,
      activeDeviceGroup,
      openCriticalCount,
      openWarningCount,
      onlineDeviceCount,
      offlineDeviceCount
    } = this.props;
    const deviceDataloaded = isDef(onlineDeviceCount) && isDef(offlineDeviceCount);
    const showOverlay = isPending && (!openCriticalCount || !openWarningCount || !deviceDataloaded);
    const total =
      deviceDataloaded
        ? onlineDeviceCount + offlineDeviceCount
        : undefined;
    const deviceGroupName =
      activeDeviceGroup
        ? activeDeviceGroup.displayName
        : t('dashboard.panels.overview.allDevices');

    return (
      <Panel>
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.overview.header')}</PanelHeaderLabel>
        </PanelHeader>
        <PanelContent className="device-stats-container">
          <div className="stat-header">{deviceGroupName}</div>
          <StatGroup className="stats-group">
            <StatProperty
              className="stat-property"
              value={renderUndefined(openCriticalCount)}
              label={t('dashboard.panels.overview.critical')}
              svg={svgs.critical}
              size="medium"
              svgClassName="severity-critical" />
            <StatProperty
              className="stat-property"
              value={renderUndefined(openWarningCount)}
              label={t('dashboard.panels.overview.warnings')}
              svg={svgs.warning}
              size="medium"
              svgClassName="severity-warning" />
            <StatProperty
              className="stat-property"
              value={renderUndefined(total)}
              label={t('dashboard.panels.overview.total')}
              size="medium" />
            <StatProperty
              className="stat-property"
              value={renderUndefined(onlineDeviceCount)}
              label={t('dashboard.panels.overview.connected')}
              size="medium" />
            <StatProperty
              className="stat-property"
              value={renderUndefined(offlineDeviceCount)}
              label={t('dashboard.panels.overview.notConnected')}
              size="medium" />
          </StatGroup>
        </PanelContent>
        {showOverlay && <PanelOverlay><Indicator /></PanelOverlay>}
        {error && <PanelError><AjaxError t={t} error={error} /></PanelError>}
      </Panel>
    );
  }
}
