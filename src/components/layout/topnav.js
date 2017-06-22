// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';

import Logo from './logo/logo.js';


class TopNav extends Component {
  render() {
    return (
      <Navbar inverse collapseOnSelect fixedTop fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Logo />
          </Navbar.Brand>
          <Navbar.Brand>
            <div>Remote Monitoring</div>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavDropdown eventKey={3} title="Configuration" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>
            <NavItem eventKey={1} href="#">Administrator</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default TopNav;