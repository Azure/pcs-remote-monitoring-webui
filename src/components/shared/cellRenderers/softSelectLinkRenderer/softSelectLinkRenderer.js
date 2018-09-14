// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from "react";

import { isFunc } from 'utilities';
import { GlimmerRenderer } from 'components/shared/cellRenderers';

import '../cellRenderer.css';

export class SoftSelectLinkRenderer extends Component {

  onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { context, rowIndex } = this.props;
    context.onSoftSelectChange(rowIndex);
  };

  render() {
    const { value, context, data } = this.props;
    return (
      <div className="pcs-renderer-cell">
        <GlimmerRenderer value={data.isNew} />
        {
          isFunc(context.onSoftSelectChange)
            ? <a href="" className="soft-select-link-cell" onClick={this.onClick}>{value}</a>
            : value
        }
      </div>
    );
  }
}
