// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { Route, Switch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { permissions } from 'services/models';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from 'components/shell/deviceGroupDropdown';
import { ManageDeviceGroupsBtnContainer as ManageDeviceGroupsBtn } from 'components/shell/manageDeviceGroupsBtn';
import { TimeIntervalDropdown } from 'components/shell/timeIntervalDropdown';
import { Notifications } from './notifications';
import { Jobs } from './jobs';
import {
  PageContent,
  ContextMenu,
  ContextMenuAlign,
  RefreshBar,
  PageTitle,
  Protected,
  StatSection,
  StatGroup,
  StatProperty
} from 'components/shared';
import { svgs, renderUndefined } from 'utilities';

import './summary.css';

export const Summary = ({
  alertProps,
  jobProps,
  criticalAlertCount,
  warningAlertCount,
  alertCount,
  failedJobsCount,
  succeededJobsCount,
  jobsCount,
  onTimeIntervalChange,
  timeInterval,
  ...props
}) => [
    <ContextMenu key="context-menu">
      <ContextMenuAlign key="left" left={true}>
        <DeviceGroupDropdown />
        <Protected permission={permissions.updateDeviceGroups}>
          <ManageDeviceGroupsBtn />
        </Protected>
      </ContextMenuAlign>
      <ContextMenuAlign key="right">
        <TimeIntervalDropdown
          onChange={onTimeIntervalChange}
          value={timeInterval}
          t={props.t} />
        <RefreshBar
          refresh={props.refreshData}
          time={props.lastUpdated}
          isPending={alertProps.isPending || jobProps.isPending}
          t={props.t} />
      </ContextMenuAlign>
    </ContextMenu>,
    <PageContent className="maintenance-container summary-container" key="page-content">
      <PageTitle titleValue={props.t('maintenance.title')} />
      <StatSection>
        <StatGroup>
          <StatProperty
            value={renderUndefined(alertCount)}
            label={props.t('maintenance.openAlerts')}
            size="large" />
        </StatGroup>
        <StatGroup>
          <StatProperty
            value={renderUndefined(criticalAlertCount)}
            label={props.t('maintenance.critical')}
            svg={svgs.critical}
            svgClassName="stat-critical" />
          <StatProperty
            value={renderUndefined(warningAlertCount)}
            label={props.t('maintenance.warning')}
            svg={svgs.warning}
            svgClassName="stat-warning" />
        </StatGroup>
        <StatGroup>
          <StatProperty
            value={renderUndefined(failedJobsCount)}
            label={props.t('maintenance.failedJobs')}
            size="large" />
        </StatGroup>
        <StatGroup>
          <StatProperty
            value={renderUndefined(jobsCount)}
            label={props.t('maintenance.total')} />
          <StatProperty
            value={renderUndefined(succeededJobsCount)}
            label={props.t('maintenance.succeeded')} />
        </StatGroup>
      </StatSection>
      <div className="tab-container">
        <NavLink to={'/maintenance/notifications'} className="tab" activeClassName="active">{props.t('maintenance.notifications')}</NavLink>
        <NavLink to={'/maintenance/jobs'} className="tab" activeClassName="active">{props.t('maintenance.jobs')}</NavLink>
      </div>
      <div className="grid-container">
        <Switch>
          <Route exact path={'/maintenance/notifications'} render={() => <Notifications {...props} {...alertProps} />} />
          <Route exact path={'/maintenance/jobs'} render={() => <Jobs {...props} {...jobProps} />} />
        </Switch>
      </div>
    </PageContent>
  ];
