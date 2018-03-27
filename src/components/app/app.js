// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { SettingsContainer } from './flyouts';

// App Components
import Header from './header/header';
import Navigation from './navigation/navigation';
import Main from './main/main';

// Page Components
import  {
  DashboardContainer as DashboardPage,
  DevicesContainer as DevicesPage,
  RulesContainer as RulesPage,
  MaintenanceContainer as MaintenancePage,
  PageNotFoundContainer as PageNotFound
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

  constructor(props) {
    super(props);

    this.state = { openFlyout: '' };
  }

  componentDidMount() {
    const { history, registerRouteEvent } = this.props;
    // Initialize listener to inject the route change event into the epic action stream
    history.listen(({ pathname }) => registerRouteEvent(pathname));
  }

  closeFlyout = () => this.setState({ openFlyout: '' });

  openSettings = () => this.setState({ openFlyout: 'settings' });

  render() {
    return (
      <div className={`app-container theme-${this.props.theme}`}>
        <div className="app">
          <Navigation tabs={tabConfigs} t={this.props.t} />
          <Main>
            <Header openSettings={this.openSettings} logout={this.props.logout} t={this.props.t} />
            <Switch>
              <Redirect exact from="/" to={dashboardTab.to} />
              <Route exact path={dashboardTab.to} component={DashboardPage} />
              <Route exact path={devicesTab.to} component={DevicesPage} />
              <Route exact path={rulesTab.to} component={RulesPage} />
              <Route path={maintenanceTab.to} component={MaintenancePage} />
              <Route component={PageNotFound} />
            </Switch>
            { this.state.openFlyout === 'settings' && <SettingsContainer onClose={this.closeFlyout} /> }
          </Main>
        </div>
      </div>
    );
  }

}

export default App;
