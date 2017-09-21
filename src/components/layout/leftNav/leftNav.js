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

const tabConfig = [
  { path: '/dashboard',    icon: DashboardIcon,    name: lang.DASHBOARD_LABEL },
  { path: '/devices',      icon: DevicesIcon,      name: lang.DEVICES },
  { path: '/rulesActions', icon: RulesActionsIcon, name: lang.RULES_ACTIONS },
  { path: '/maintenance',  icon: MaintenanceIcon,  name: lang.MAINTENANCE }
];

class LeftNav extends Component {

  constructor(props) {
    super(props);

    this.state = { isExpanded: true };

    this.tabLinks = tabConfig.map((item, index) =>
      <Link key={index} to={item.path} className="leftnav-item-container">
        <div className="leftnav-item-icon"><img src={item.icon} alt={item.name} /></div>
        <div className="leftnav-item-text">{item.name}</div>
      </Link>
    );
  }

  toggleExpansion = () => this.setState({ isExpanded: !this.state.isExpanded });

  render() {
    return (
      <div className={`left-nav ${this.state.isExpanded ? 'expanded' : ''}`}>

        <div className="leftnav-item-container">
          <div className="leftnav-item-icon">
            <img src={ContosoIcon} className="page-title-icon" alt="ContosoIcon" />
          </div>
          <div className="leftnav-item-text">{lang.CONTOSO}</div>
        </div>

        <div className="leftnav-item-container hamburger" onClick={this.toggleExpansion}>
          <div className="leftnav-item-icon">
            <img src={HamburgerIcon} alt="HamburgerIcon" />
          </div>
        </div>

        {this.tabLinks}

      </div>
    );
  }
}

export default LeftNav;
