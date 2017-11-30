// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import lang from "../../../common/lang";

import DisabledSvg from '../../../assets/icons/Disabled.svg';

import '../cellRenderer.css'

class ConnectionStatusRenderer extends React.Component {
  render() {
    const { value } = this.props;
    const cellClasses = `pcs-renderer-cell ${value && 'highlight'}`;

    return (
      <div className={cellClasses}>
        {value ? null :<img src={DisabledSvg} className="pcs-renderer-icon" alt='Connection Status Icon'/>}
        <div className="pcs-renderer-text">
          {value ? lang.CONNECTED : lang.OFFLINE}
        </div>
      </div>
    );
  }
}

export default ConnectionStatusRenderer;
