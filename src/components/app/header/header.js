// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import ProfileImagePath from 'assets/images/profile.png';

import './header.css';

/** The header component for the top of the page */
class Header extends Component {

  constructor(props) {
    super(props);

    this.state = { dropdownExpanded: false };

    window.onmousedown = ({ target }) => {
      if (target.className !== 'dropdown-item' && this.state.dropdownExpanded) {
        this.setState({ dropdownExpanded: false });
      }
    }
  }

  logout = () => {
    this.toggleDropdown();
    this.props.logout();
  }

  toggleDropdown = () => {
    this.setState({ dropdownExpanded: !this.state.dropdownExpanded })
  };

  render() {
    return (
      <header className="app-header">
        <div className="breadcrumbs">{ this.props.breadcrumbs || '' }</div>
        <div className="label">{ this.props.t('header.appName') }</div>
        <div className="items-container">
          <button className="item-icon profile" onClick={this.toggleDropdown}>
            <img src={ProfileImagePath} alt={ this.props.t('header.logout') } />
          </button>
          {
            this.state.dropdownExpanded &&
            <div className="profile-dropdown">
              <button className="dropdown-item" onClick={this.logout}>{ this.props.t('header.logout') }</button>
            </div>
          }
        </div>
      </header>
    );
  }
};

export default Header;
