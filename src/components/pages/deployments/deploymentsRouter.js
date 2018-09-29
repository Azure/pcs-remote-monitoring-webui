// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { DeploymentDetailsContainer } from './deploymentDetails';
import { DeploymentsContainer } from './deploymentsHome';

export const DeploymentsRouter = () => (
  <Switch>
    <Route exact path={'/deployments'} render={(routeProps) => <DeploymentsContainer {...routeProps} />} />
    <Route exact path={'/deployments/:id'} render={(routeProps) => <DeploymentDetailsContainer {...routeProps} />} />
    <Redirect to="/deployments" />
  </Switch>
);
