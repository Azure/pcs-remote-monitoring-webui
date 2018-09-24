// Copyright (c) Microsoft. All rights reserved.
import React, { Component } from 'react';
import { deploymentsColumnDefs, defaultDeploymentsGridProps } from './deploymentsGridConfig';
import { PcsGrid } from 'components/shared';
import { isFunc, translateColumnDefs } from 'utilities';

export class DeploymentsGrid extends Component {
  constructor(props) {
    super(props);

    this.columnDefs = [
      deploymentsColumnDefs.name,
      deploymentsColumnDefs.package,
      deploymentsColumnDefs.deviceGroup,
      deploymentsColumnDefs.priority,
      deploymentsColumnDefs.type,
      deploymentsColumnDefs.applied,
      deploymentsColumnDefs.succeeded,
      deploymentsColumnDefs.failed,
      deploymentsColumnDefs.dateCreated,
    ];
  }
  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
  */
  onGridReady = gridReadyEvent => {
    this.deploymentsGridApi = gridReadyEvent.api;
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultDeploymentsGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      sizeColumnsToFit: true,
      deltaRowDataMode: true,
      ...this.props, // Allow default property overrides
      onGridReady: event => this.onGridReady(event), // Wrap in a function to avoid closure issues
      getRowNodeId: ({ id }) => id,
      enableSorting: true,
      unSortIcon: true,
      context: {
        t: this.props.t
      }
    };

    return (
      <PcsGrid {...gridProps} key="deployments-grid" />
    );
  }
}
