// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { permissions } from 'services/models';
import { DevicesGrid } from './devicesGrid';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from 'components/app/deviceGroupDropdown';
import { ManageDeviceGroupsBtnContainer as ManageDeviceGroupsBtn } from 'components/app/manageDeviceGroupsBtn';
import {
  AjaxError,
  Btn,
  ContextMenu,
  PageContent,
  Protected,
  RefreshBar,
  SearchInput
} from 'components/shared';
import { DeviceNewContainer } from './flyouts/deviceNew';
import { SIMManagementContainer } from './flyouts/SIMManagement';
import { svgs } from 'utilities';

import './devices.css';

const closedFlyoutState = { openFlyoutName: undefined };

export class Devices extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...closedFlyoutState,
      contextBtns: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPending && nextProps.isPending !== this.props.isPending) {
      // If the grid data refreshes, hide the flyout and deselect soft selections
      this.setState(closedFlyoutState);
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  openSIMManagement = () => this.setState({ openFlyoutName: 'sim-management' });
  openNewDeviceFlyout = () => this.setState({ openFlyoutName: 'new-device' });

  onContextMenuChange = contextBtns => this.setState({
    contextBtns,
    openFlyoutName: undefined
  });

  onGridReady = gridReadyEvent => this.deviceGridApi = gridReadyEvent.api;

  searchOnChange = ({ target: { value } }) => {
    if (this.deviceGridApi) this.deviceGridApi.setQuickFilter(value);
  };

  render() {
    const { t, devices, deviceGroupError, deviceError, isPending, lastUpdated, fetchDevices } = this.props;
    const gridProps = {
      onGridReady: this.onGridReady,
      rowData: isPending ? undefined : devices || [],
      onContextMenuChange: this.onContextMenuChange,
      t: this.props.t
    };
    const newDeviceFlyoutOpen = this.state.openFlyoutName === 'new-device';
    const simManagementFlyoutOpen = this.state.openFlyoutName === 'sim-management';

    const error = deviceGroupError || deviceError;

    return [
      <ContextMenu key="context-menu">
        <DeviceGroupDropdown />
        <SearchInput onChange={this.searchOnChange} placeholder={t('devices.searchPlaceholder')} />
        { this.state.contextBtns }
        <Protected permission={permissions.updateSIMManagement}>
          <Btn svg={svgs.simmanagement} onClick={this.openSIMManagement}>{t('devices.flyouts.SIMManagement.title')}</Btn>
        </Protected>
        <Protected permission={permissions.createDevices}>
          <Btn svg={svgs.plus} onClick={this.openNewDeviceFlyout}>{t('devices.flyouts.new.contextMenuName')}</Btn>
        </Protected>
        <Protected permission={permissions.updateDeviceGroups}>
          <ManageDeviceGroupsBtn />
        </Protected>
      </ContextMenu>,
      <PageContent className="devices-container" key="page-content">
        <RefreshBar refresh={fetchDevices} time={lastUpdated} isPending={isPending} t={t} />
        { !!error && <AjaxError t={t} error={error} /> }
        { !error && <DevicesGrid {...gridProps} /> }
{ newDeviceFlyoutOpen && <DeviceNewContainer onClose={this.closeFlyout} /> }
        { simManagementFlyoutOpen && <SIMManagementContainer onClose={this.closeFlyout} /> }
      </PageContent>
    ];
  }
}
