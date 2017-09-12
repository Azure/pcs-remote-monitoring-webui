// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Profile from '../../../layouts/main/profile.js';

import Setting from '../../../assets/icons/Setting.svg';

import './topNav.css';

/**
 * Props:
 *  breadcrumbs: The name of the current page or the breadcrumbs for that page
 *  projectName: Name of the current project
 */
class TopNav extends Component {
  render() {
    return (
      <div className="top-nav">
        <div className="breadcrumbs">
          {this.props.breadcrumbs || ''}
        </div>
        <div className="project-name">
          {this.props.projectName || ''}
        </div>
        <div className="user-settings">
          <img className="settings-icon" src={Setting} alt="Setting" />
          <Profile />
        </div>
      </div>
    );
  }
}

export default TopNav;
