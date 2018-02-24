// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

// App Components
import Header from './header/header';
import Navigation from './navigation/navigation';
import Main from './main/main';
import PageContent from './pageContent/pageContent';

// Page Components
import  {
  DashboardContainer as DashboardPage,
  DevicesContainer as DevicesPage,
  RulesContainer as RulesPage,
  MaintenanceContainer as MaintenancePage,
  PageNotFound
} from 'components/pages';

import { svgs } from 'utilities';

import './app.css';

/** The navigation tab configurations */
const dashboardTab   = { to: '/dashboard',   svg: svgs.tabs.dashboard,   labelId: 'tabs.dashboard' };
const devicesTab     = { to: '/devices',     svg: svgs.tabs.devices,     labelId: 'tabs.devices' };
const rulesTab       = { to: '/rules',       svg: svgs.tabs.rules,       labelId: 'tabs.rules' };
const maintenanceTab = { to: '/maintenance', svg: svgs.tabs.maintenance, labelId: 'tabs.maintenance' };
const tabConfigs = [ dashboardTab, devicesTab, rulesTab, maintenanceTab ];

/** The base component for the app */
class App extends Component {

  componentDidMount() {
    const { history, registerRouteEvent } = this.props;
    // Initialize listener to inject the route change event into the epic action stream
    history.listen(({ pathname }) => registerRouteEvent(pathname));
  }

  render() {
    return (
      <div className="app">
        <Navigation tabs={tabConfigs} t={this.props.t} />
        <Main>
          <Header logout={this.props.logout} t={this.props.t} />
          <PageContent>
            <Switch>
              <Redirect exact from="/" to={dashboardTab.to} />
              <Route exact path={dashboardTab.to} component={DashboardPage} />
              <Route exact path={devicesTab.to} component={DevicesPage} />
              <Route exact path={rulesTab.to} component={RulesPage} />
              <Route exact path={maintenanceTab.to} component={MaintenancePage} />
              <Route component={PageNotFound} />
            </Switch>
          </PageContent>
        </Main>
      </div>
    );
  }

}

export default App;
