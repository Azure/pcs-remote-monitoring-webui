// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import { Svg } from 'components/shared';
import { svgs } from 'utilities';

const Crumb = ({ children }) => <div className="crumb">{ children }</div>
const Chevron = () => <Svg path={svgs.chevronRight} className="chevron-icon" />;

const DashboardCrumbs = ({ t }) => <Crumb>{t('tabs.dashboard')}</Crumb>;
const DevicesCrumbs = ({ t }) => <Crumb>{t('tabs.devices')}</Crumb>;
const RulesCrumbs = ({ t }) => <Crumb>{t('tabs.rules')}</Crumb>;
const MaintenanceCrumbs = ({ t }) => <Crumb>{t('tabs.maintenance')}</Crumb>;
const RuleDetailsCrumbs = ({ t, match }) => [
  <NavLink to="/maintenance/notifications" className="crumb" key={1}>{t('tabs.maintenance')}</NavLink>,
  <Chevron key={2}/>,
  <Crumb key={3}>{match.params.id}</Crumb>
];
const JobDetailsCrumbs = ({ t, match }) => [
  <NavLink to="/maintenance/jobs" className="crumb" key={1}>{t('tabs.maintenance')}</NavLink>,
  <Chevron key={2}/>,
  <Crumb key={3}>{match.params.id}</Crumb>
];

export const Breadcrumbs = ({ t }) => (
  <Switch>
    <Route exact path={'/dashboard'} render={props => <DashboardCrumbs {...props} t={t} />} />
    <Route exact path={'/devices'} render={props => <DevicesCrumbs {...props} t={t} />} />
    <Route exact path={'/rules'} render={props => <RulesCrumbs {...props} t={t} />} />
    <Route exact path={'/maintenance/:path(notifications|jobs)'} render={props => <MaintenanceCrumbs {...props} t={t} />} />
    <Route exact path={'/maintenance/rule/:id'} render={props => <RuleDetailsCrumbs {...props} t={t} />} />
    <Route exact path={'/maintenance/job/:id'}render={props => <JobDetailsCrumbs {...props} t={t} />} />
  </Switch>
);
