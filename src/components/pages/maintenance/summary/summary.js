// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { permissions, toDiagnosticsModel } from 'services/models';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from 'components/shell/deviceGroupDropdown';
import { ManageDeviceGroupsBtnContainer as ManageDeviceGroupsBtn } from 'components/shell/manageDeviceGroupsBtn';
import { TimeIntervalDropdownContainer as TimeIntervalDropdown } from 'components/shell/timeIntervalDropdown';
import { Notifications } from './notifications';
import { Jobs } from './jobs';
import {
  ComponentArray,
  ContextMenu,
  ContextMenuAlign,
  RefreshBarContainer as RefreshBar,
  PageContent,
  PageTitle,
  Protected,
  StatSection,
  StatGroup,
  StatProperty
} from 'components/shared';
import { svgs, renderUndefined } from 'utilities';

import './summary.scss';

export class Summary extends Component {

  tabClickHandler = (tabName) => {
    this.props.logEvent(toDiagnosticsModel(tabName + "_Click", {}));
  }

  render() {
    return(
    <ComponentArray>
      <ContextMenu>
        <ContextMenuAlign left={true}>
          <DeviceGroupDropdown />
          <Protected permission={permissions.updateDeviceGroups}>
            <ManageDeviceGroupsBtn />
          </Protected>
        </ContextMenuAlign>
        <ContextMenuAlign>
          <TimeIntervalDropdown
            onChange={this.props.onTimeIntervalChange}
            value={this.props.timeInterval}
            t={this.props.t} />
          <RefreshBar
            refresh={this.props.refreshData}
            time={this.props.lastUpdated}
            isPending={this.props.alertProps.isPending || this.props.jobProps.isPending}
            t={this.props.t} />
        </ContextMenuAlign>
      </ContextMenu>
      <PageContent className="maintenance-container summary-container">
        <PageTitle titleValue={this.props.t('maintenance.title')} />
        <StatSection className="summary-stat-container">
          <StatGroup>
            <StatProperty
              value={renderUndefined(this.props.alertCount)}
              label={this.props.t('maintenance.openAlerts')}
              size="large" />
          </StatGroup>
          <StatGroup>
            <StatProperty
              value={renderUndefined(this.props.criticalAlertCount)}
              label={this.props.t('maintenance.critical')}
              svg={svgs.critical}
              svgClassName="stat-critical" />
            <StatProperty
              value={renderUndefined(this.props.warningAlertCount)}
              label={this.props.t('maintenance.warning')}
              svg={svgs.warning}
              svgClassName="stat-warning" />
          </StatGroup>
          <StatGroup>
            <StatProperty
              value={renderUndefined(this.props.failedJobsCount)}
              label={this.props.t('maintenance.failedJobs')}
              size="large" />
          </StatGroup>
          <StatGroup>
            <StatProperty
              value={renderUndefined(this.props.jobsCount)}
              label={this.props.t('maintenance.total')} />
            <StatProperty
              value={renderUndefined(this.props.succeededJobsCount)}
              label={this.props.t('maintenance.succeeded')} />
          </StatGroup>
        </StatSection>
        <div className="tab-container">
          <NavLink to={'/maintenance/notifications'} className="tab" activeClassName="active" onClick={this.tabClickHandler.bind(this, 'AlertsTab')}>{this.props.t('maintenance.notifications')}</NavLink>
          <NavLink to={'/maintenance/jobs'} className="tab" activeClassName="active" onClick={this.tabClickHandler.bind(this, 'JobsTab')}>{this.props.t('maintenance.jobs')}</NavLink>
        </div>
        <div className="grid-container">
          <Switch>
            <Route exact path={'/maintenance/notifications'} render={() => <Notifications {...this.props} {...this.props.alertProps} />} />
            <Route exact path={'/maintenance/jobs'} render={() => <Jobs {...this.props} {...this.props.jobProps} />} />
          </Switch>
        </div>
      </PageContent>
    </ComponentArray>);
  }
};
