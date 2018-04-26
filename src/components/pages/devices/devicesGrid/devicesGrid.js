// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Btn, PcsGrid } from 'components/shared';
import { checkboxParams, deviceColumnDefs, defaultDeviceGridProps } from './devicesGridConfig';
import { DeviceDeleteContainer } from '../flyouts/deviceDelete';
import { DeviceJobsContainer } from '../flyouts/deviceJobs';
import { isFunc, svgs, translateColumnDefs } from 'utilities';

const closedFlyoutState = { openFlyoutName: undefined };

/**
 * A grid for displaying devices
 *
 * Encapsulates the PcsGrid props
 */
export class DevicesGrid extends Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = closedFlyoutState;

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

    this.contextBtns = [
      <Btn key="jobs" svg={svgs.reconfigure} onClick={this.openFlyout('jobs')}>{props.t('devices.flyouts.jobs.title')}</Btn>,
      <Btn key="delete" svg={svgs.trash} onClick={this.openFlyout('delete')}>{props.t('devices.flyouts.delete.title')}</Btn>
    ];
  }

  openFlyout = (flyoutName) => () => this.setState({ openFlyoutName: flyoutName });

  getOpenFlyout = () => {
    switch (this.state.openFlyoutName) {
      case 'delete':
        return <DeviceDeleteContainer key="device-flyout-key" onClose={this.closeFlyout} devices={this.deviceGridApi.getSelectedRows()} />
      case 'jobs':
        return <DeviceJobsContainer key="device-flyout-key" onClose={this.closeFlyout} devices={this.deviceGridApi.getSelectedRows()} />
      default:
        return null;
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

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
   * Handles soft select props method
   *
   * @param device The currently soft selected device
   * @param rowEvent The rowEvent to pass on to the underlying grid
   */
  onSoftSelectChange = (device, rowEvent) => {
    const { onSoftSelectChange } = this.props;
    this.setState(closedFlyoutState);
    if (isFunc(onSoftSelectChange)) {
      onSoftSelectChange(device, rowEvent);
    }
  }

  /**
   * Handles context filter changes and calls any hard select props method
   *
   * @param {Array} selectedDevices A list of currently selected devices
   */
  onHardSelectChange = (selectedDevices) => {
    const { onContextMenuChange, onHardSelectChange } = this.props;
    if (isFunc(onContextMenuChange)) {
      onContextMenuChange(selectedDevices.length > 0 ? this.contextBtns : null);
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
      onSoftSelectChange: this.onSoftSelectChange,
      onHardSelectChange: this.onHardSelectChange,
      onGridReady: this.onGridReady
    };

    return ([
      <PcsGrid key="device-grid-key" {...gridProps} />,
      this.getOpenFlyout()
    ]);
  }
}
