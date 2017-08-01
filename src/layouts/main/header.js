// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Setting from '../../assets/icons/Setting.svg';
import './header.css';
import ProfileImage from '../../assets/icons/ProfileImage.png';
import lang from '../../common/lang';
import TopNavFilter from '../../components/TopNavFilter/TopNavFilter.js';

class TopNav extends Component {
  selectHandler = (eventKey, event) => {
    switch (eventKey) {
      case 3.1:
        this.refs.customFlyout.show();
        break;
      case 3.2:
        this.refs.customDialog.show();
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="header-navigation">
        <div className="dashboard">
          {lang.DASHBOARD.DASHBOARD}
        </div>
        <div className="project-settings">
          <span className="project-name">
            {lang.DASHBOARD.AZUREPROJECTNAME}
          </span>
          <span>
            <img className="settings" src={Setting} alt="Setting" />
            <img
              className="top-nav-icon"
              src={ProfileImage}
              alt="ProfileImage"
            />
          </span>
        </div>
        <TopNavFilter />
      </div>
    );
  }
}

export default TopNav;
