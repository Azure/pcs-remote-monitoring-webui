// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { Provider } from "react-redux";
import Main from "./layouts/main/main.js";
import Dashboard from "./layouts/dashboard/dashboard.js";
import Devices from "./layouts/devices/devices.js";
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
        <IndexRoute component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/devices" component={Devices}></Route>
      </Route>
    </Router>
  </Provider>,
  app
);

registerServiceWorker();