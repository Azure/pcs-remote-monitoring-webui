// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { Provider } from "react-redux";
import * as actionTypes from './actions/actionTypes';
import Main from "./components/layout/main/main.js";
import DashboardPage from "./components/pages/dashboard/dashboard.js";
import DevicesPage from "./components/pages/devices/devices.js";
import RulesAndActionsPage from "./components/pages/rulesAndActions/rulesAndActions.js";
import MaintenancePage from "./components/pages/maintenance/maintenance.js";
import RuleDetailsPage from "./components/maintenance/ruleDetails.js";
import MaintenanceWidget from "./components/maintenance/maintenanceWidget.js";
import AlarmsByRuleGrid from "./components/maintenance/alarmsByRuleGrid.js";
import SystemStatusDetailsGrid from "./components/systemStatusDetailsGrid/systemStatusDetailsGrid.js";
import SystemStatusGrid from "./components/systemStatusGrid/systemStatusGrid.js";
import registerServiceWorker from "./registerServiceWorker";
import initialState from "./reducers/initialState";
import configureStore from "./store/configureStore";
import auth from "./common/auth";
import "./polyfills";

import "./index.css";

const app = document.getElementById("root");
const store = configureStore(initialState);
const closeOpenFlyouts = () => store.dispatch({ type: actionTypes.FLYOUT_HIDE });

// Start sign in process if required
auth.onLoad();

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Main} onChange={closeOpenFlyouts}>
        <IndexRoute component={DashboardPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/devices" component={DevicesPage} />
        <Route path="/rulesActions" component={RulesAndActionsPage} />
        <Route path="/maintenance" component={MaintenancePage}>
          <IndexRoute component={MaintenanceWidget} />
          <Route path="/maintenance/:id" component={MaintenanceWidget}>
            <IndexRoute component={AlarmsByRuleGrid} />
            <Route path="/alarmsByRule" component={AlarmsByRuleGrid} />
            <Route path="/systemStatus" component={SystemStatusGrid} />
          </Route>
          <Route path="rule/:id" component={RuleDetailsPage} />
          <Route path="job/(:jobId)" component={SystemStatusDetailsGrid} />
        </Route>
      </Route>
    </Router>
  </Provider>,
  app
);

registerServiceWorker();
