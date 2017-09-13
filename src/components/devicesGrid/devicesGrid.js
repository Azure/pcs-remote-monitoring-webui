// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Rx from 'rxjs';
import iotHubManagerService from '../../services/iotHubManagerService';
import PcsGrid from '../pcsGrid/pcsGrid';
import { deviceColumnDefs, deviceGridProps } from './devicesConfig';
import { isFunction } from '../../common/utils';

import './devicesGrid.css';

/**
 * A grid for displaying devices
 */
class DevicesGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
    };

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

  /** Initialize the devices when the component loads */
  componentDidMount() {
    this.loadDevices();
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

  /** Makes the API call to load the devices */
  loadDevices() {
    Rx.Observable.fromPromise(iotHubManagerService.getDevices())
      .map(data => data.items)
      .subscribe(devices => this.setState({ devices: devices }));
  }

  render() {
    return (
      <PcsGrid
        /* Grid Properties */
        { ...deviceGridProps } // Default device grid options
        columnDefs={this.columnDefs}
        rowData={this.state.devices}
        { ...this.props } // Allow default property overrides
        /* Grid Events */
        onGridReady={this.onGridReady}
      />
    );
  }
}

export default DevicesGrid;
