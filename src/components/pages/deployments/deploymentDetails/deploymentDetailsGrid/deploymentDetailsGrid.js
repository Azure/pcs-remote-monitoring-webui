// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { deploymentDetailsColumnDefs, defaultDeploymentDetailsGridProps } from './deploymentDetailsGridConfig';
import { translateColumnDefs, isFunc } from 'utilities';
import { PcsGrid, ComponentArray } from 'components/shared';
import { DeviceDetailsContainer } from 'components/pages/devices/flyouts';
import { toSinglePropertyDiagnosticsModel } from 'services/models';

const closedFlyoutState = {
  openFlyoutName: undefined,
  selectedDevice: undefined
};

export class DeploymentDetailsGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...closedFlyoutState
    };

    this.columnDefs = [
      deploymentDetailsColumnDefs.name,
      deploymentDetailsColumnDefs.deploymentStatus,
      deploymentDetailsColumnDefs.firmware,
      deploymentDetailsColumnDefs.lastMessage,
      deploymentDetailsColumnDefs.start,
      deploymentDetailsColumnDefs.end
    ];
  }

  onGridReady = gridReadyEvent => {
    this.deployedDevicesGridApi = gridReadyEvent.api;
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  getModuleStatus = data => ({
    code: data.code,
    description: data.description
  });

  onSoftSelectChange = (deviceRowId, rowEvent) => {
    const { onSoftSelectChange, logEvent } = this.props;
    const rowData = (this.deployedDevicesGridApi.getDisplayedRowAtIndex(deviceRowId) || {}).data;
    logEvent(
      toSinglePropertyDiagnosticsModel(
        'DeploymentDetail_DeviceGridClick',
        'DeviceId',
        rowData ? rowData.id : ''));
    if (rowData && rowData.device) {
      this.setState({
        openFlyoutName: 'deviceDetails',
        selectedDevice: rowData.device,
        moduleStatus: this.getModuleStatus(rowData)
      });
    } else {
      this.closeFlyout();
    }
    if (isFunc(onSoftSelectChange)) {
      onSoftSelectChange(rowData, rowEvent);
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  getSoftSelectId = ({ id = '' }) => id;

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultDeploymentDetailsGridProps,
      context: {
        t: this.props.t,
      },
      rowData: this.props.deployedDevices,
      getRowNodeId: ({ id }) => id,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      onGridReady: this.onGridReady,
      getSoftSelectId: this.getSoftSelectId,
      onSoftSelectChange: this.onSoftSelectChange
    };

    return (
      <ComponentArray>
        <PcsGrid {...gridProps} />
        {
          this.state.openFlyoutName === 'deviceDetails' &&
          <DeviceDetailsContainer
            t={this.props.t}
            onClose={this.closeFlyout}
            device={this.state.selectedDevice}
            moduleStatus={this.state.moduleStatus} />
        }
      </ComponentArray>
    );
  }
}
