// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Profile from '../profile/profile.js';
import PcsTooltip from '../../shared/pcsTooltip/pcsTooltip';
import lang from '../../../common/lang';

import Setting from '../../../assets/icons/Setting.svg';

import './topNav.css';

/**
 * Props:
 *  breadcrumbs: The name of the current page or the breadcrumbs for that page
 *  projectName: Name of the current project
 */
class TopNav extends Component {
  constructor(props) {
      super(props);
      this.state = { isShow: false };
  }

  showToolTip = () => this.setState({ isShow: true });

  hideToolTip = () => this.setState({ isShow: false });

  render() {
    const tooltipProps = {
      show: this.state.isShow,
      content: lang.COMING_SOON
    };
    return (
      <div className="top-nav">
        <div className="breadcrumbs">
          {this.props.breadcrumbs || ''}
        </div>
        <div className="project-name">
          {this.props.projectName || ''}
        </div>
        <div className="user-settings">
          <img
            className="settings-icon"
            onMouseOver={this.showToolTip}
            onMouseOut={this.hideToolTip}
            src={Setting}
            alt="Setting" />
          <PcsTooltip {...tooltipProps} />
          <Profile />
        </div>
      </div>
    );
  }
}

export default TopNav;
