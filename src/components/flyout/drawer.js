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
  }

  render() {
    const description = this.props.description
      ? <div className="drawer-description">
          {this.props.description}
        </div>
      : null;
    return (
      <div className="drawer-wrapper">
        <div
          className="drawer-header"
          onClick={() => {
            this.setState({ showContent: !this.state.showContent });
          }}
        >
          {this.props.title}
          <img src={ChevronIcon} className="chevron-open" alt="ChevronIcon" />
        </div>
        {this.state.showContent && description}
        {this.state.showContent && this.props.children}
      </div>
    );
  }
}

export default Drawer;
