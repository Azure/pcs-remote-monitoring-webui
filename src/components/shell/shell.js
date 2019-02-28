// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { Shell as FluentShell } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Shell';

// App Components
import Config from 'app.config';
import Main from './main/main';
import { PageNotFoundContainer as PageNotFound } from './pageNotFound'
import { Hyperlink, Svg } from 'components/shared';

import './shell.scss';

/** The base component for the app shell */
class Shell extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isNavExpanded: true,
      isMastheadMoreExpanded: false
    };
  }

  componentDidMount() {
    const { history, registerRouteEvent } = this.props;
    // Initialize listener to inject the route change event into the epic action stream
    history.listen(({ pathname }) => registerRouteEvent(pathname));
  }

  render() {
    const { pagesConfig, t, theme, children, denyAccess } = this.props;
    return (
      <FluentShell theme={theme} isRtl={false} navigation={this.getNavProps()} masthead={this.getMastheadProps()}>
        {
          denyAccess &&
          <div className="app">
            <Main>
              <div className="access-denied">
                <Trans i18nKey={'accessDenied.message'}>
                  You don't have permissions.
                  <Hyperlink href={Config.contextHelpUrls.accessDenied} target="_blank">{t('accessDenied.learnMore')}</Hyperlink>
                </Trans>
              </div>
            </Main>
          </div>
        }
        {
          (!denyAccess && pagesConfig) &&
          <div className="app">
            <Main>
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
      </FluentShell>
    );
  }

  getNavProps() {
    const { pagesConfig, t, denyAccess } = this.props;
    if (denyAccess || !pagesConfig) {
      return null;
    }

    return {
      isExpanded: this.state.isNavExpanded,
      onClick: this.handleGlobalNavToggle,
      attr: {
        navButton: {
          title: t(this.state.isNavExpanded ? 'globalNav.collapse' : 'globalNav.expand'),
        },
      },
      children: pagesConfig.map((tabProps, i) => {
        const label = t(tabProps.labelId);
        return (
          <NavLink key={i} to={tabProps.to} className="global-nav-item" activeClassName="global-nav-item-active" title={label}>
            <Svg path={tabProps.svg} className="global-nav-item-icon" />
            <div className="global-nav-item-text">{label}</div>
          </NavLink>
        );
      })
    };
  }

  getMastheadProps() {
    const { appName, appLogo, logoPendingStatus, pagesConfig, t, denyAccess, openSystemSettings, openUserProfile, openHelpFlyout, openFlyout } = this.props;
    if (denyAccess) {
      return {
        branding: logoPendingStatus ? t('header.appName') : this.getMastheadBranding(appName, appLogo),
        more: {
          title: t('header.more'),
          selected: this.state.isMastheadMoreExpanded,
          onClick: this.handleMastheadMoreToggle,
        },
      };
    } else if (pagesConfig) {
      return {
        branding: logoPendingStatus ? t('header.appName') : this.getMastheadBranding(appName, appLogo),
        more: {
          title: t('header.more'),
          selected: this.state.isMastheadMoreExpanded,
          onClick: this.handleMastheadMoreToggle,
        },
        toolbarItems: [{
          icon: 'settings',
          label: t('settingsFlyout.title'),
          selected: openFlyout === 'settings',
          onClick: openSystemSettings
        }, {
          icon: 'help',
          label: t('helpFlyout.title'),
          selected: openFlyout === 'help',
          onClick: openHelpFlyout
        }, {
          icon: 'contact',
          label: t('profileFlyout.title'),
          selected: openFlyout === 'profile',
          onClick: openUserProfile
        }]
      };
    } else {
      return null; // no masthead
    }
  }

  getMastheadBranding(appName, appLogo) {
    return (
      <div className="nav-item">
        <div className="nav-item-icon">
          <img src={appLogo} alt="Logo" />
        </div>
        <div className="nav-item-text">{appName}</div>
      </div>
    );
  }

  handleGlobalNavToggle = (e) => {
    e && e.stopPropagation();
    this.setState({
      isNavExpanded: !this.state.isNavExpanded
    });
  }

  handleMastheadMoreToggle = (e) => {
    e && e.stopPropagation();
    this.setState({
      isMastheadMoreExpanded: !this.state.isMastheadMoreExpanded
    });
  }
}

export default Shell;
