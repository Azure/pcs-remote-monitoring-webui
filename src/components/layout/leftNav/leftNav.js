// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Link } from "react-router";
import lang from '../../../common/lang';

import HamburgerIcon from '../../../assets/icons/Hamburger.svg';
import DashboardIcon from '../../../assets/icons/Dashboard.svg';
import MaintenanceIcon from '../../../assets/icons/Maintenance.svg';
import DevicesIcon from '../../../assets/icons/Devices.svg';
import RulesActionsIcon from '../../../assets/icons/RulesActionsIcon.svg';
import ContosoIcon from '../../../assets/icons/Contoso.svg';

import './leftNav.css';

class LeftNav extends Component {

  constructor(props) {
    super(props);
    this.state = { showAll: true };

    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav() {
    this.setState({ showAll: !this.state.showAll });
  }

  render() {
    const iconStyle = { height: 16, width: 16 };

    const navItems = [
      { path: '/dashboard',    icon: DashboardIcon,    name: lang.DASHBOARD_LABEL },
      { path: '/devices',      icon: DevicesIcon,      name: lang.DEVICES },
      { path: '/rulesActions', icon: RulesActionsIcon, name: lang.RULES_ACTIONS },
      { path: '/maintenance',  icon: MaintenanceIcon,  name: lang.MAINTENANCE }
    ];

    const navigationTabs = navItems.map((item, index) =>
        <Link key={index} to={item.path} className="pcs-nav-link">
          <img src={item.icon} {...iconStyle} alt={item.name} />
          {this.state.showAll ? <span className="pcs-nav-label">{item.name}</span> : ''}
        </Link>
      );

    return (
      <div className={`left-nav ${this.state.showAll ? 'expanded' : ''}`}>
        <div className="contoso">
          <img
            src={ContosoIcon}
            {...iconStyle}
            className="contoso"
            alt="ContosoIcon"
            onClick={this.toggleNav}
          />
          {
            this.state.showAll &&
            <div className="contoso-text">
              {lang.CONTOSO}
            </div>
          }
        </div>
        <div className="hamburger">
          <img
            src={HamburgerIcon}
            {...iconStyle}
            alt="HamburgerIcon"
            onClick={this.toggleNav}
          />
        </div>
        <div className="pcs-nav-container">
          {navigationTabs}
        </div>
      </div>
    );
  }
}

export default LeftNav;
