// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import Spinner from '../spinner/spinner';

import './dashboardPanel.css';

/**
 * DashboardPanel contains layout related styling details for creating a dashboard panel
 *
 * Accepted Props:
 *  title: A string or JSX object for the panel header on the top banner left
 *  actions: A string or JSX object for the panel actions on the top banner right
 */
class DashboardPanel extends Component {
  render() {
    const classNames = 'dashboard-panel ' + (this.props.className || '');
    return (
      <div className={classNames}>
        <div className="panel-header-container">
          <div className="panel-header-indicator">
            <div className="panel-header">
              {this.props.title}
            </div>
            {this.props.showHeaderSpinner && <Spinner size="small"/>}
          </div>
          {this.props.actions ? <div className="panel-actions-container">{this.props.actions}</div> : ''}
        </div>
        <div className="panel-contents">{this.props.children}</div>
        { this.props.showContentSpinner ? <div className="initial-loading"><Spinner size='large'/></div> : null}
      </div>
    );
  }
}

export default DashboardPanel;
