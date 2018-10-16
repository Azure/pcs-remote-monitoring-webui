// Copyright (c) Microsoft. All rights reserved.
import React, { Component } from 'react';
import { permissions } from 'services/models';
import { packagesColumnDefs, defaultPackagesGridProps } from './packagesGridConfig';
import { Btn, ComponentArray, PcsGrid, Protected } from 'components/shared';
import { isFunc, translateColumnDefs, svgs } from 'utilities';
import { checkboxColumn } from 'components/shared/pcsGrid/pcsGridConfig';
import { PackageDeleteContainer } from '../modals';

import './packagesGrid.css';

const closedModalState = {
  openModalName: undefined
};

export class PackagesGrid extends Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      ...closedModalState,
      hardSelectedPackages: []
    };

    this.columnDefs = [
      checkboxColumn,
      packagesColumnDefs.name,
      packagesColumnDefs.type,
      packagesColumnDefs.dateCreated
    ];

    this.contextBtns =
      <ComponentArray>
        <Protected permission={permissions.deletePackages}>
          <Btn svg={svgs.trash} onClick={this.openModal('delete-package')}>{props.t('packages.delete')}</Btn>
        </Protected>
      </ComponentArray>;
  }

  getOpenModal = () => {
    if (this.state.openModalName === 'delete-package' && this.state.hardSelectedPackages[0]) {
      return <PackageDeleteContainer
        itemId={this.state.hardSelectedPackages[0].id}
        onClose={this.closeModal}
        onDelete={this.closeModal}
        title={this.props.t('packages.modals.delete.title')}
        deleteInfo={this.props.t('packages.modals.delete.info')} />
    }
    return null;
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
      onContextMenuChange(selectedPackages.length === 1 ? this.contextBtns : null);
      this.setState({
        hardSelectedPackages: selectedPackages
      });
    }
    if (isFunc(onHardSelectChange)) {
      onHardSelectChange(selectedPackages);
    }
  }

  closeModal = () => this.setState(closedModalState);

  openModal = (modalName) => () => this.setState({
    openModalName: modalName
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

    return (
      <ComponentArray>
        <PcsGrid {...gridProps} />
        {this.getOpenModal()}
      </ComponentArray>
    );
  }
}
