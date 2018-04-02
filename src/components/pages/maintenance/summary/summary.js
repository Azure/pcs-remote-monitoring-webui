// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { Route, Switch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { Notifications } from './notifications';
import { Jobs } from './jobs';
import { PageContent, ContextMenu, RefreshBar, Svg } from 'components/shared';
import { svgs, renderUndefined } from 'utilities';

import './summary.css';

const StatCell = ({ value, label, svg, className = '' }) => (
  <div className={`stat-cell ${className}`}>
    { svg && <Svg path={svg} className="stat-icon" />}
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export const Summary = ({
  alertProps,
  jobProps,
  criticalAlertCount,
  warningAlertCount,
  alertCount,
  failedJobsCount,
  succeededJobsCount,
  jobsCount,
  ...props
}) => [
  <ContextMenu key="context-menu">
    <RefreshBar
      refresh={props.refreshData}
      time={props.lastUpdated}
      isPending={alertProps.isPending || jobProps.isPending}
      t={props.t} />
  </ContextMenu>,
  <PageContent className="maintenance-container summary-container" key="page-content">
    <h1 className="maintenance-header">Maintenance</h1>
    <div className="stat-container">
      <div className="stat-group">
        <StatCell value={renderUndefined(alertCount)} label={'Open Alarms'} />
        <div className="stat-column">
          <StatCell className="critical" value={renderUndefined(criticalAlertCount)} label={'Critical'} svg={svgs.critical} />
          <StatCell className="warning" value={renderUndefined(warningAlertCount)} label={'Warning'} svg={svgs.warning} />
        </div>
      </div>
      <div className="stat-group">
        <StatCell value={renderUndefined(failedJobsCount)} label={'Failed Jobs'} />
        <div className="stat-column">
          <StatCell value={renderUndefined(jobsCount)} label={'Total'} />
          <StatCell value={renderUndefined(succeededJobsCount)} label={'Succeeded'} />
        </div>
      </div>
    </div>
    <div className="tab-container">
      <NavLink to={'/maintenance/notifications'} className="tab" activeClassName="active">Notifications</NavLink>
      <NavLink to={'/maintenance/jobs'} className="tab" activeClassName="active">Jobs</NavLink>
    </div>
    <div className="grid-container">
      <Switch>
        <Route exact path={'/maintenance/notifications'} render={() => <Notifications {...props} {...alertProps} />} />
        <Route exact path={'/maintenance/jobs'} render={() => <Jobs {...props} {...jobProps} />} />
      </Switch>
    </div>
  </PageContent>
];
