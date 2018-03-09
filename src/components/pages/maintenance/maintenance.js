// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Summary } from './summary/summary';
import { RuleDetails } from './ruleDetails/ruleDetails';
import { JobDetails } from './jobDetails/jobDetails';

import './maintenance.css';

export class Maintenance extends Component {
  render () {
    return (
      <Switch>
        <Route exact path={'/maintenance/:path(notifications|jobs)'} component={Summary} />
        <Route exact path={'/maintenance/rule/:id'} component={RuleDetails} />
        <Route exact path={'/maintenance/job/:id'} component={JobDetails} />
        <Redirect to="/maintenance/notifications" />
      </Switch>
    );
  }
}
