// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from "react";

import { isFunc } from 'utilities';
import { GlimmerRenderer } from 'components/shared/cellRenderers';

import '../cellRenderer.scss';

export class SoftSelectLinkRenderer extends Component {

  onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { context, data } = this.props;
    // To ensure up to date information, ALWAYS use the provided ID to
    // get the entity from the redux store. Note that the full data object
    // is passed along, but that is with the understanding that it may be
    // out of date. This is for convenience in analytics logging only.
    context.onSoftSelectChange(context.getSoftSelectId(data), data);
  };

  render() {
    const { value, context, data } = this.props;
    return (
      <div className="pcs-renderer-cell">
        <GlimmerRenderer value={data.isNew} />
        {
          isFunc(context.onSoftSelectChange)
            ? <button type="button" className="pcs-renderer-link soft-select-link" onClick={this.onClick}>{value}</button>
            : value
        }
      </div>
    );
  }
}
