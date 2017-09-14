// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import lang from "../../../common/lang";

import '../cellRenderer.css'

class IsSimulatedRenderer extends React.Component {
  render() {
    const { value } = this.props;
    const cellClasses = `pcs-renderer-cell ${value && 'highlight'}`;

    return (
      <div className={cellClasses}>
        <div className="pcs-renderer-icon"></div>
        <div className="pcs-renderer-text">
          {value ? lang.DEVICES.YES : lang.DEVICES.NO}
        </div>
      </div>
    );
  }
}

export default IsSimulatedRenderer;
