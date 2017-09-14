// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PcsGrid from '../pcsGrid/pcsGrid';
import { deviceColumnDefs, defaultDeviceGridProps } from './devicesConfig';
import { isFunction } from '../../common/utils';

import './devicesGrid.css';

/**
 * A grid for displaying devices
 * 
 * Encapsulates the PcsGrid props
 */
class DevicesGrid extends Component {

  constructor(props) {
    super(props);

    // Default device grid columns
    this.columnDefs = [
      deviceColumnDefs.id,
      deviceColumnDefs.isSimulated,
      deviceColumnDefs.deviceType,
      deviceColumnDefs.firmware,
      deviceColumnDefs.telemetry,
      deviceColumnDefs.status,
      deviceColumnDefs.lastConnection
    ];
  }

  /** 
   * Get the grid api options 
   * 
   * @param {Object} gridReadyEvent An object containing access to the grid APIs   
   */
  onGridReady = gridReadyEvent => {
    gridReadyEvent.api.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunction(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  }

  render() {
    return (
      <PcsGrid
        /* Grid Properties */
        { ...defaultDeviceGridProps }
        columnDefs={this.columnDefs}
        { ...this.props } // Allow default property overrides
        /* Grid Events */
        onGridReady={this.onGridReady}
      />
    );
  }
}

export default DevicesGrid;
