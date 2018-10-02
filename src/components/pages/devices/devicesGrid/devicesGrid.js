// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { permissions } from 'services/models';
import { Btn, ComponentArray, PcsGrid, Protected } from 'components/shared';
import { deviceColumnDefs, defaultDeviceGridProps } from './devicesGridConfig';
import { DeviceDeleteContainer } from '../flyouts/deviceDelete';
import { DeviceJobsContainer } from '../flyouts/deviceJobs';
import { DeviceDetailsContainer } from '../flyouts/deviceDetails';
import { isFunc, svgs, translateColumnDefs } from 'utilities';
import { checkboxColumn } from 'components/shared/pcsGrid/pcsGridConfig';

const closedFlyoutState = {
  openFlyoutName: undefined,
  softSelectedDevice: undefined
};

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
      checkboxColumn,
      deviceColumnDefs.id,
      deviceColumnDefs.isSimulated,
      deviceColumnDefs.deviceType,
      deviceColumnDefs.firmware,
      deviceColumnDefs.telemetry,
      deviceColumnDefs.status,
      deviceColumnDefs.lastConnection
    ];

    this.contextBtns =
      <ComponentArray>
        <Protected permission={permissions.createJobs}>
          <Btn svg={svgs.reconfigure} onClick={this.openFlyout('jobs')}>{props.t('devices.flyouts.jobs.title')}</Btn>
        </Protected>
        <Protected permission={permissions.deleteDevices}>
          <Btn svg={svgs.trash} onClick={this.openFlyout('delete')}>{props.t('devices.flyouts.delete.title')}</Btn>
        </Protected>
      </ComponentArray>;
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
  */
  onGridReady = gridReadyEvent => {
    this.deviceGridApi = gridReadyEvent.api;
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  openFlyout = (flyoutName) => () => this.setState({
    openFlyoutName: flyoutName,
    softSelectedDevice: undefined
  });

  getOpenFlyout = () => {
    switch (this.state.openFlyoutName) {
      case 'delete':
        return <DeviceDeleteContainer key="delete-device-key" onClose={this.closeFlyout} devices={this.deviceGridApi.getSelectedRows()} />
      case 'jobs':
        return <DeviceJobsContainer key="jobs-device-key" onClose={this.closeFlyout} devices={this.deviceGridApi.getSelectedRows()} />
      case 'details':
        return <DeviceDetailsContainer key="details-device-key" onClose={this.closeFlyout} device={this.state.softSelectedDevice} />
      default:
        return null;
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  /**
   * Handles soft select props method
   *
   * @param device The currently soft selected device
   * @param rowEvent The rowEvent to pass on to the underlying grid
   */
  onSoftSelectChange = (deviceRowId, rowEvent) => {
    const { onSoftSelectChange } = this.props;
    const device = (this.deviceGridApi.getDisplayedRowAtIndex(deviceRowId) || {}).data;
    if (device) {
      this.setState({
        openFlyoutName: 'details',
        softSelectedDevice: device
      });
    } else {
      this.closeFlyout();
    }
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

  getSoftSelectId = ({ id } = '') => id;

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultDeviceGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      sizeColumnsToFit: true,
      getSoftSelectId: this.getSoftSelectId,
      softSelectId: (this.state.softSelectedDevice || {}).id,
      ...this.props, // Allow default property overrides
      deltaRowDataMode: true,
      enableSorting: true,
      unSortIcon: true,
      getRowNodeId: ({ id }) => id,
      context: {
        t: this.props.t
      },
      /* Grid Events */
      onRowClicked: ({ node }) => node.setSelected(!node.isSelected()),
      onGridReady: this.onGridReady,
      onSoftSelectChange: this.onSoftSelectChange,
      onHardSelectChange: this.onHardSelectChange
    };

    return ([
      <PcsGrid key="device-grid-key" {...gridProps} />,
      this.getOpenFlyout()
    ]);
  }
}
