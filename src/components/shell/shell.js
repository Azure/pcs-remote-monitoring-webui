// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

// App Components
import Header from './header/header';
import NavigationContainer from './navigation/navigationContainer';
import Main from './main/main';
import { PageNotFoundContainer as PageNotFound } from './pageNotFound'

import './shell.css';

/** The base component for the app shell */
class Shell extends Component {

  constructor(props) {
    super(props);

    this.state = { openFlyout: '' };
  }

  componentDidMount() {
    const { history, registerRouteEvent } = this.props;
    // Initialize listener to inject the route change event into the epic action stream
    history.listen(({ pathname }) => registerRouteEvent(pathname));
  }

  render() {
    const { pagesConfig, crumbsConfig, openSettings, logout, t, theme, children } = this.props;

    return (
      <div className={`shell-container theme-${theme}`}>
        {
          pagesConfig &&
          <div className="shell">
            <NavigationContainer tabs={pagesConfig} t={t} />
            <Main>
              <Header crumbsConfig={crumbsConfig} openSettings={openSettings} logout={logout} t={t} />
              <Switch>
                <Redirect exact from="/" to={pagesConfig[0].to} />
                {
                  pagesConfig.map(({ to, exact, component }) =>
                    <Route key={to} exact={exact} path={to} component={component} />)
                }
                <Route component={PageNotFound} />
              </Switch>
              {children}
            </Main>
          </div>
        }
      </div>
    );
  }
}

export default Shell;
