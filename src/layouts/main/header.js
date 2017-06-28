// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import CustomFlyout from '../../components/customFlyout/customFlyout';

import Logo from './logo.js';

class TopNav extends Component {
  selectHandler = (eventKey, event) => {
    switch (eventKey) {
      case 3.1:
        this.refs.customFlyout.show();
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <Navbar inverse collapseOnSelect fixedTop fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <div><Logo /></div>
          </Navbar.Brand>
          <Navbar.Brand>
            <div>Remote Monitoring</div>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavDropdown eventKey={3} title="Configuration" id="basic-nav-dropdown" onSelect={this.selectHandler}>
              <MenuItem eventKey={3.1}>Customize Solution</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
              <CustomFlyout ref="customFlyout" />
            </NavDropdown>
            <NavItem eventKey={1} href="#">Administrator</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default TopNav;