// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { Provider } from "react-redux";
//import Main from "./layouts/main/main.js";
import Main from "./components/layout/main/main.js";
// import Dashboard from "./layouts/dashboard/dashboard.js";
//import Devices from "./layouts/devices/devices.js";
import DashboardPage from "./components/pages/dashboard/dashboard.js";
import DevicesPage from "./components/pages/devices/devices.js";
import RulesAndActionsPage from "./components/pages/rulesAndActions/rulesAndActions.js";
import MaintenancePage from "./components/pages/maintenance/maintenance";
import registerServiceWorker from "./registerServiceWorker";
import initialState from "./reducers/initialState";
import configureStore from "./store/configureStore";
import oauth2client from "./common/oauth2client";

import "./index.css";

const app = document.getElementById("root");
const store = configureStore(initialState);

oauth2client.onLoad();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={DashboardPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/devices" component={DevicesPage} />
        <Route path="/rulesActions" component={RulesAndActionsPage} />
        <Route path="/maintenance" component={MaintenancePage}/>
      </Route>
    </Router>
  </Provider>,
  app
);

registerServiceWorker();
