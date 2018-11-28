// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { deploymentDetailsColumnDefs, defaultDeploymentDetailsGridProps } from './deploymentDetailsGridConfig';
import { translateColumnDefs, isFunc } from 'utilities';
import { PcsGrid, ComponentArray } from 'components/shared';
import { DeviceDetailsContainer } from 'components/pages/devices/flyouts';
import { toSinglePropertyDiagnosticsModel } from 'services/models';

const closedFlyoutState = {
  openFlyoutName: undefined,
  selectedDeviceId: undefined
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
      deploymentDetailsColumnDefs.start,
      deploymentDetailsColumnDefs.end
    ];
    if (!props.isADMDeployment) {
      this.columnDefs.push(deploymentDetailsColumnDefs.lastMessage);
    }
  }

  getModuleStatus = data => ({
    code: data.code,
    description: data.description
  });

  onSoftSelectChange = (deviceId, rowData) => {
    //Note: only the Id is reliable, rowData may be out of date
    const { onSoftSelectChange, logEvent } = this.props;
    logEvent(
      toSinglePropertyDiagnosticsModel(
        'DeploymentDetail_DeviceGridClick',
        'DeviceId',
        deviceId));
    if (deviceId) {
      this.setState({
        openFlyoutName: 'deviceDetails',
        selectedDeviceId: deviceId,
        moduleStatus: this.getModuleStatus(rowData)
      });
    } else {
      this.closeFlyout();
    }
    if (isFunc(onSoftSelectChange)) {
      onSoftSelectChange(deviceId, rowData);
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
            deviceId={this.state.selectedDeviceId}
            moduleStatus={this.state.moduleStatus} />
        }
      </ComponentArray>
    );
  }
}
