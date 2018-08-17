// Copyright (c) Microsoft. All rights reserved.
import React, { Component } from 'react';
import { permissions } from 'services/models';
import { packagesColumnDefs, defaultPackagesGridProps } from './packagesGridConfig';
import { Btn, PcsGrid, Protected } from 'components/shared';
import { isFunc, translateColumnDefs, svgs } from 'utilities';
import { checkboxColumn } from 'components/shared/pcsGrid/pcsGridConfig';

import './packagesGrid.css';

const closedFlyoutState = {
  openFlyoutName: undefined
};

export class PackagesGrid extends Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      ...closedFlyoutState
    };

    this.columnDefs = [
      checkboxColumn,
      packagesColumnDefs.name,
      packagesColumnDefs.type,
      packagesColumnDefs.dateCreated
    ];

    this.contextBtns = [
      <Protected key="delete" permission={permissions.deletePackages}>
        <Btn svg={svgs.trash} onClick={this.openFlyout('delete')}>{props.t('packages.delete')}</Btn>
      </Protected>
    ];
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
  */
  onGridReady = gridReadyEvent => {
    this.packagesGridApi = gridReadyEvent.api;
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  /**
   * Handles context filter changes and calls any hard select props method
   *
   * @param {Array} selectedPackages A list of currently selected packages
   */
  onHardSelectChange = (selectedPackages) => {
    const { onContextMenuChange, onHardSelectChange } = this.props;
    if (isFunc(onContextMenuChange)) {
      onContextMenuChange(selectedPackages.length > 0 ? this.contextBtns : null);
    }
    if (isFunc(onHardSelectChange)) {
      onHardSelectChange(selectedPackages);
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  openFlyout = (flyoutName) => () => this.setState({
    openFlyoutName: flyoutName
  });

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultPackagesGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      sizeColumnsToFit: true,
      deltaRowDataMode: true,
      ...this.props, // Allow default property overrides
      onGridReady: event => this.onGridReady(event), // Wrap in a function to avoid closure issues
      getRowNodeId: ({ id }) => id,
      enableSorting: true,
      unSortIcon: true,
      onHardSelectChange: this.onHardSelectChange,
      context: {
        t: this.props.t
      }
    };

    return (<PcsGrid {...gridProps} key="rules-grid" />);
  }
}
