// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { AjaxError, Indicator } from 'components/shared';
import { Svg } from 'components/shared/svg/svg';
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
          <div className="stat-container">
            <div className="stat-cell col-third">
              <div className="stat-value critical">
                <span>{renderUndefined(openCriticalCount)}</span>
                <Svg path={svgs.critical} className="severity-icon"/>
              </div>
              <div className="stat-label">{t('dashboard.panels.overview.critical')}</div>
            </div>

            <div className="stat-cell col-third">
              <div className="stat-value warning">
                <span>{renderUndefined(openWarningCount)}</span>
                <Svg path={svgs.warning} className="severity-icon"/>
              </div>
              <div className="stat-label">{t('dashboard.panels.overview.warnings')}</div>
            </div>

            <div className="stat-cell col-third">
              <div className="stat-value">{renderUndefined(total)}</div>
              <div className="stat-label">{t('dashboard.panels.overview.total')}</div>
            </div>

            <div className="stat-cell col-third">
              <div className="stat-value">{renderUndefined(onlineDeviceCount)}</div>
              <div className="stat-label">{t('dashboard.panels.overview.connected')}</div>
            </div>

            <div className="stat-cell col-third">
              <div className="stat-value">{renderUndefined(offlineDeviceCount)}</div>
              <div className="stat-label">{t('dashboard.panels.overview.notConnected')}</div>
            </div>
          </div>
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
        { error && <PanelError><AjaxError t={t} error={error} /></PanelError> }
      </Panel>
    );
  }
}
