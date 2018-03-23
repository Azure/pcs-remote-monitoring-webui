// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Indicator } from 'components/shared';
import { Svg } from 'components/shared/svg/svg';
import { svgs } from 'utilities';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay
} from 'components/pages/dashboard/panel';

import './overviewPanel.css';

const isDef = (val) => typeof val !== 'undefined';
const EMPTY = '--';

export class OverviewPanel extends Component {
  constructor(props) {
    super(props);

    this.state = { isPending: true };
  }

  render() {
    const {
      t,
      isPending,
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
    return (
      <Panel>
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.overview.header')}</PanelHeaderLabel>
          { !showOverlay && isPending && <Indicator size="small" /> }
        </PanelHeader>
        <PanelContent className="device-stats-container">
          <div className="stat-header">{t('dashboard.panels.overview.allDevices')}</div>
          <div className="stat-container">
            <div className="stat-cell col-third">
              <div className="stat-value critical">
                <span>{ isDef(openCriticalCount) ? openCriticalCount : EMPTY }</span>
                <Svg path={svgs.critical} className="severity-icon"/>
              </div>
              <div className="stat-label">{t('dashboard.panels.overview.critical')}</div>
            </div>

            <div className="stat-cell col-third">
              <div className="stat-value warning">
                <span>{ isDef(openWarningCount) ? openWarningCount : EMPTY }</span>
                <Svg path={svgs.warning} className="severity-icon"/>
              </div>
              <div className="stat-label">{t('dashboard.panels.overview.warnings')}</div>
            </div>

            <div className="stat-cell col-third">
              <div className="stat-value">{ total || EMPTY }</div>
              <div className="stat-label">{t('dashboard.panels.overview.total')}</div>
            </div>

            <div className="stat-cell col-third">
              <div className="stat-value">{ isDef(onlineDeviceCount) ? onlineDeviceCount : EMPTY }</div>
              <div className="stat-label">{t('dashboard.panels.overview.connected')}</div>
            </div>

            <div className="stat-cell col-third">
              <div className="stat-value">{ isDef(offlineDeviceCount) ? offlineDeviceCount : EMPTY }</div>
              <div className="stat-label">{t('dashboard.panels.overview.notConnected')}</div>
            </div>
          </div>
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
      </Panel>
    );
  }
}
