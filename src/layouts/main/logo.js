// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import logo from './logo.svg';
import './logo.css';

class Logo extends Component {
  render() {
    return (
      <img src={logo} className="appLogo" alt="logo" />
    );
  }
}

export default Logo;