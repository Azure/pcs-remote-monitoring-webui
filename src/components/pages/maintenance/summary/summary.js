// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { Notifications } from './notifications';
import { Jobs } from './jobs';
import { PageContent, ContextMenu } from 'components/shared';

export const Summary = ({ match: { params: { path } } }) => [
  <ContextMenu key="context-menu"></ContextMenu>,
  <PageContent className="maintenance-container" key="page-content">
    <div className="header">Maintenance</div>
    <div className="tab-container">
      <NavLink to={'/maintenance/notifications'} className="tab" activeClassName="active">Notifications</NavLink>
      <NavLink to={'/maintenance/jobs'} className="tab" activeClassName="active">Jobs</NavLink>
    </div>
    <div className="grid-container">
      <Switch>
        <Route exact path={'/maintenance/notifications'} component={Notifications} />
        <Route exact path={'/maintenance/jobs'} component={Jobs} />
      </Switch>
    </div>
  </PageContent>
];
