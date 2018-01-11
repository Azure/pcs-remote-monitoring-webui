// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import ChevronIcon from '../../assets/icons/Chevron.svg';

import './drawer.css';

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: this.props.toggle
    };

    this.toggleHeader = this.toggleHeader.bind(this);
  }

  toggleHeader() {
    this.setState({ showContent: !this.state.showContent });
  }

  render() {
    const displayContent = this.state.showContent ? {} : { display: 'none' };
    const description = this.props.description
      ? <div className="drawer-description">
          {this.props.description}
        </div>
      : null;
    return (
      <div className="drawer-wrapper">
        <div className="drawer-header" onClick={this.toggleHeader}>
          {this.props.title}
          {
            this.state.showContent
              ? <img src={ChevronIcon} className="chevron-close" alt="Up Arrow" />
              : <img src={ChevronIcon} className="chevron-open" alt="Down Arrow" />
          }
        </div>
        <div style={displayContent}>
          {description}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Drawer;
