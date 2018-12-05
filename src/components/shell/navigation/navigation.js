// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Svg, Indicator } from 'components/shared';

import { svgs } from 'utilities';

import './navigation.scss';

/** A window size less than this will automatically collapse the left nav */
const minExpandedNavWindowWidth = 800;

/**
 * A presentational component for nav item svgs
 *
 * @param {ReactSVGProps} props see https://www.npmjs.com/package/react-svg
 */
const NavIcon = (props) => (
  <Svg {...props} className="nav-item-icon" />
);

/** A presentational component navigation tab links */
const TabLink = (props) => (
  <NavLink to={props.to} className="nav-item" activeClassName="active">
    <NavIcon path={props.svg} />
    <div className="nav-item-text">{props.t(props.labelId)}</div>
  </NavLink>
);

/** The navigation component for the left navigation */
class Navigation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      lastWidth: window.innerWidth
    };
  }

  componentDidMount() {
    // Collapse the nav if the window width is too small
    window.addEventListener('resize', this.collapseNav);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.collapseNav);
  }

  collapseNav = () => {
    if (
      window.innerWidth < minExpandedNavWindowWidth
      && window.innerWidth < this.state.lastWidth // When the window is shrinking
      && !this.state.collapsed
    ) {
      this.setState({ collapsed: true, lastWidth: window.innerWidth });
    } else {
      this.setState({ lastWidth: window.innerWidth });
    }
  }

  toggleExpanded = (event) => {
    this.setState(
      { collapsed: !this.state.collapsed },
      () => window.dispatchEvent(new Event('resize'))
    );
  }

  render() {
    const isExpanded = !this.state.collapsed;
    const { name, logo, isDefaultLogo, t, getLogoPending } = this.props;
    return (
      <nav className={`app-nav ${isExpanded && 'expanded'}`}>
        <div className="nav-item company">
          {
            getLogoPending
              ? <Indicator size="medium" />
              : isDefaultLogo
                ? <NavIcon path={logo} />
                : <div className="nav-item-icon">
                    <img src={logo} alt="Logo" />
                  </div>
          }
          {!getLogoPending && <div className="nav-item-text">{t(name)}</div>}
        </div>
        <button className="nav-item hamburger" onClick={this.toggleExpanded} aria-label="Hamburger">
          <NavIcon path={svgs.hamburger} />
        </button>
        {this.props.tabs.map((tabProps, i) => <TabLink {...tabProps} t={t} key={i} />)}
      </nav>
    );
  }
}

export default Navigation;
