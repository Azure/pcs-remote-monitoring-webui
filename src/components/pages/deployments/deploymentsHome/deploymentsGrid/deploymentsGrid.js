// Copyright (c) Microsoft. All rights reserved.
import React, { Component } from 'react';
import { deploymentsColumnDefs, defaultDeploymentsGridProps } from './deploymentsGridConfig';
import { PcsGrid } from 'components/shared';
import { translateColumnDefs } from 'utilities';

export class DeploymentsGrid extends Component {
  constructor(props) {
    super(props);

    this.columnDefs = [
      deploymentsColumnDefs.name,
      deploymentsColumnDefs.package,
      deploymentsColumnDefs.deviceGroup,
      deploymentsColumnDefs.priority,
      deploymentsColumnDefs.type,
      deploymentsColumnDefs.targeted,
      deploymentsColumnDefs.applied,
      deploymentsColumnDefs.succeeded,
      deploymentsColumnDefs.failed,
      deploymentsColumnDefs.dateCreated,
    ];
  }

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultDeploymentsGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      ...this.props, // Allow default property overrides
      getRowNodeId: ({ id }) => id,
      context: {
        t: this.props.t
      }
    };

    return (
      <PcsGrid {...gridProps} />
    );
  }
}
