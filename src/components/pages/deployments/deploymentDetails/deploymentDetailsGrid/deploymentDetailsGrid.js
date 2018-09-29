// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { deploymentDetailsColumnDefs, defaultDeploymentDetailsGridProps } from './deploymentDetailsGridConfig';
import { translateColumnDefs } from 'utilities';
import { PcsGrid } from 'components/shared';

export class DeploymentDetailsGrid extends Component {
  constructor(props) {
    super(props);

    this.columnDefs = [
      deploymentDetailsColumnDefs.name,
      deploymentDetailsColumnDefs.deploymentStatus,
      deploymentDetailsColumnDefs.firmware,
      deploymentDetailsColumnDefs.lastMessage,
      deploymentDetailsColumnDefs.start,
      deploymentDetailsColumnDefs.end
    ];
  }

  onGridReady = gridReadyEvent => this.deployedDevicesGridApi = gridReadyEvent.api;

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultDeploymentDetailsGridProps,
      t: this.props.t,
      rowData: this.props.deployedDevices,
      getRowNodeId: ({ id }) => id,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs)
    };

    return (<PcsGrid {...gridProps} />);
  }
}
