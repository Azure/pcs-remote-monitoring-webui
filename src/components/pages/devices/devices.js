// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { permissions, toDiagnosticsModel } from 'services/models';
import { DevicesGrid } from './devicesGrid';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from 'components/shell/deviceGroupDropdown';
import { ManageDeviceGroupsBtnContainer as ManageDeviceGroupsBtn } from 'components/shell/manageDeviceGroupsBtn';
import {
  AjaxError,
  Btn,
  ComponentArray,
  ContextMenu,
  ContextMenuAlign,
  PageContent,
  PageTitle,
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

    this.props.updateCurrentWindow('Devices');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPending && nextProps.isPending !== this.props.isPending) {
      // If the grid data refreshes, hide the flyout and deselect soft selections
      this.setState(closedFlyoutState);
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  openSIMManagement = () => this.setState({ openFlyoutName: 'sim-management' });
  openNewDeviceFlyout = () => {
    this.setState({ openFlyoutName: 'new-device' });
    this.props.logEvent(toDiagnosticsModel('Devices_NewClick', {}));
  }

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
            <SearchInput onChange={this.searchOnChange} placeholder={t('devices.searchPlaceholder')} />
            {this.state.contextBtns}
            <Protected permission={permissions.updateSIMManagement}>
              <Btn svg={svgs.simmanagement} onClick={this.openSIMManagement}>{t('devices.flyouts.SIMManagement.title')}</Btn>
            </Protected>
            <Protected permission={permissions.createDevices}>
              <Btn svg={svgs.plus} onClick={this.openNewDeviceFlyout}>{t('devices.flyouts.new.contextMenuName')}</Btn>
            </Protected>
          </ContextMenuAlign>
        </ContextMenu>
        <PageContent className="devices-container">
          <RefreshBar refresh={fetchDevices} time={lastUpdated} isPending={isPending} t={t} />
          <PageTitle titleValue={t('devices.title')} />
          {!!error && <AjaxError t={t} error={error} />}
          {!error && <DevicesGrid {...gridProps} />}
          {newDeviceFlyoutOpen && <DeviceNewContainer onClose={this.closeFlyout} />}
          {simManagementFlyoutOpen && <SIMManagementContainer onClose={this.closeFlyout} />}
        </PageContent>
      </ComponentArray>
    );
  }
}
