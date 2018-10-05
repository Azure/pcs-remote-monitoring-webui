// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { permissions } from 'services/models';
import {
  AjaxError,
  Btn,
  ComponentArray,
  ContextMenu,
  ContextMenuAlign,
  PageContent,
  Protected,
  RefreshBar,
  PageTitle
} from 'components/shared';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from 'components/shell/deviceGroupDropdown';
import { ManageDeviceGroupsBtnContainer as ManageDeviceGroupsBtn } from 'components/shell/manageDeviceGroupsBtn';
import { DeploymentsGrid } from './deploymentsGrid';
import { DeploymentNewContainer } from './flyouts';
import { svgs } from 'utilities';

import './deployments.css';

const closedFlyoutState = { openFlyoutName: undefined };

export class Deployments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...closedFlyoutState,
      contextBtns: null
    };

    if (!this.props.lastUpdated && !this.props.error) {
      this.props.fetchDeployments();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPending && nextProps.isPending !== this.props.isPending) {
      // If the grid data refreshes, hide the flyout
      this.setState(closedFlyoutState);
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  onContextMenuChange = contextBtns => this.setState({
    contextBtns,
    openFlyoutName: undefined
  });

  openNewDeploymentFlyout = () => this.setState({
    openFlyoutName: 'newDeployment'
  });

  onGridReady = gridReadyEvent => this.deploymentGridApi = gridReadyEvent.api;

  getSoftSelectId = ({ id } = '') => id;

  onSoftSelectChange = (deviceRowId) => {
    const rowData = (this.deploymentGridApi.getDisplayedRowAtIndex(deviceRowId) || {}).data;
    this.props.history.push(`/deployments/${rowData.id}`)
  }

  render() {
    const { t, deployments, error, isPending, fetchDeployments, lastUpdated } = this.props;
    const gridProps = {
      onGridReady: this.onGridReady,
      rowData: isPending ? undefined : deployments || [],
      refresh: fetchDeployments,
      onContextMenuChange: this.onContextMenuChange,
      t: t,
      getSoftSelectId: this.getSoftSelectId,
      onSoftSelectChange: this.onSoftSelectChange
    };

    return (
      <ComponentArray>
        <ContextMenu>
          <ContextMenuAlign left={true}>
            <DeviceGroupDropdown />
            <Protected permission={permissions.updateDeviceGroups}>
              <ManageDeviceGroupsBtn />
            </Protected>
          </ContextMenuAlign>
          <ContextMenuAlign>
            {this.state.contextBtns}
            <Protected permission={permissions.createDeployments}>
              <Btn svg={svgs.plus} onClick={this.openNewDeploymentFlyout}>{t('deployments.flyouts.new.contextMenuName')}</Btn>
            </Protected>
          </ContextMenuAlign>
        </ContextMenu>
        <PageContent className="deployments-page-container">
          <RefreshBar refresh={fetchDeployments} time={lastUpdated} isPending={isPending} t={t} />
          <PageTitle className="deployments-title" titleValue={t('deployments.title')} />
          {!!error && <AjaxError t={t} error={error} />}
          {!error && <DeploymentsGrid {...gridProps} />}
          {this.state.openFlyoutName === 'newDeployment' && <DeploymentNewContainer t={t} onClose={this.closeFlyout} />}
        </PageContent>
      </ComponentArray>
    );
  }
}
