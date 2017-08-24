// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import './flyoutSection.css';

/** 
 * FlyoutSection contains layout related styling details for creating form sections in the flyout
 *  
 * Accepted Props: 
 *  header: A string or JSX object for the flyout section header
 */ 
class FlyoutSection extends React.Component {
  render() {
    return (
      <div className="pcs-flyout-section">
        <div className="pcs-header">{this.props.header}</div>
        <div className="pcs-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default FlyoutSection;
