// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Link } from "react-router";

import './deepLinkSection.css';

class DeepLinkSection extends Component {
  render() {
    return (
      <div className="deep-link-container">
        <div className="link-text">{this.props.description}</div>
        <Link to={this.props.path} className="deep-link">{this.props.linkText}</Link>
      </div>
    );
  }
}

export default DeepLinkSection;
