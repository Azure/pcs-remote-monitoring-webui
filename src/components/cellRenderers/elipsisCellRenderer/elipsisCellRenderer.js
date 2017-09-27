// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { Link } from 'react-router';

import ElipsisSvg from '../../../assets/icons/Elipsis.svg';

import '../cellRenderer.css'
import './elipsisCellRenderer.css'

class ElipsisCellRenderer extends React.Component {
  render() {
    return (
      <Link className="pcs-renderer-cell elipsis-renderer" to={this.props.to}>
        <img src={ElipsisSvg} className="pcs-renderer-icon" alt='Click to explorer' />
      </Link>
    );
  }
}

export default ElipsisCellRenderer;
