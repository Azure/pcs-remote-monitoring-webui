// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { PcsGrid } from 'components/shared';
import { checkboxParams, deviceColumnDefs, defaultDeviceGridProps } from './devicesGridConfig';
import { isFunc, translateColumnDefs } from 'utilities';

/**
 * A grid for displaying devices
 *
 * Encapsulates the PcsGrid props
 */
export class DevicesGrid extends Component {
  constructor(props) {
    super(props);

    // Default device grid columns
    this.columnDefs = [
      { ...deviceColumnDefs.id, ...checkboxParams },
      deviceColumnDefs.isSimulated,
      deviceColumnDefs.deviceType,
      deviceColumnDefs.firmware,
      deviceColumnDefs.telemetry,
      deviceColumnDefs.status,
      deviceColumnDefs.lastConnection
    ];
  }

  componentWillReceiveProps(nextProps) {
    const { hardSelectedDevices } = nextProps;
    if (!hardSelectedDevices || !this.deviceGridApi ) return;
    const deviceIdSet = new Set((hardSelectedDevices || []).map(({ Id }) => Id));

    this.deviceGridApi.forEachNode(node => {
      if (deviceIdSet.has(node.data.Id) && !node.selected) {
        node.setSelected(true);
      }
    });
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady = gridReadyEvent => {
    this.deviceGridApi = gridReadyEvent.api;
    gridReadyEvent.api.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  /**
   * Handles context filter changes and calls any hard select props method
   *
   * @param {Array} selectedDevices A list of currently selected devices
   */
  onHardSelectChange = (selectedDevices) => {
    const { contextActions, onContextMenuChange, onHardSelectChange} = this.props;
    if (isFunc(onContextMenuChange)) {
      contextActions.actions.devicesSelectionChanged(selectedDevices);
      onContextMenuChange(selectedDevices.length > 0 ? this.contextBtns : '');
    }
    if (isFunc(onHardSelectChange)) {
      onHardSelectChange(selectedDevices);
    }
  }

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultDeviceGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      onRowDoubleClicked: ({ node }) => node.setSelected(!node.isSelected()),
      ...this.props, // Allow default property overrides
      context: {
        t: this.props.t
      },
      /* Grid Events */
      onHardSelectChange: this.onHardSelectChange,
      onGridReady: this.onGridReady
    };
    return (
      <PcsGrid {...gridProps} />
    );
  }
}
