// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import './leftnav.css';

class LeftNav extends Component {
  render() {
    return (
      <Nav bsStyle="pills" stacked className="sidebar">
        <NavItem href="#/dashboard">Dashboard</NavItem>
        <NavItem href="#/devices">Devices</NavItem>
        <NavItem href="#/configuration">Configuration</NavItem>
      </Nav>
    );
  }
}

export default LeftNav;