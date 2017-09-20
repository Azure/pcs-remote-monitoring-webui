// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { Provider } from "react-redux";
import Main from "./components/layout/main/main.js";
import DashboardPage from "./components/pages/dashboard/dashboard.js";
import DevicesPage from "./components/pages/devices/devices.js";
import RulesAndActionsPage from "./components/pages/rulesAndActions/rulesAndActions.js";
import MaintenancePage from "./components/pages/maintenance/maintenance.js";
import RuleDetailsPage from "./components/maintenance/ruleDetails.js";
import MaintenanceWidget from "./components/maintenance/maintenanceWidget.js";
import AlarmsByRuleGrid from "./components/maintenance/alarmsByRuleGrid.js";
import registerServiceWorker from "./registerServiceWorker";
import initialState from "./reducers/initialState";
import configureStore from "./store/configureStore";
import auth from "./common/auth";

import "./index.css";

const app = document.getElementById("root");
const store = configureStore(initialState);

// Start sign in process if required
auth.onLoad();

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={DashboardPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/devices" component={DevicesPage} />
        <Route path="/rulesActions" component={RulesAndActionsPage} />
        <Route path="/maintenance" component={MaintenancePage}>
          <IndexRoute component={MaintenanceWidget} />
          <Route path="rule/:id" component={RuleDetailsPage} />
          <Route path="/maintenance/:id" component={MaintenanceWidget}>
            <IndexRoute component={AlarmsByRuleGrid} />
            <Route path="/alarmsByRule" component={AlarmsByRuleGrid} />
          </Route>
          <Route path="/maintenance/:id" component={AlarmsByRuleGrid}>
            <Route path="rule/:id" component={RuleDetailsPage} />
          </Route>
        </Route>
      </Route>
    </Router>
  </Provider>,
  app
);

registerServiceWorker();
