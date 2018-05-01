// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { DevicesGrid } from './devicesGrid';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from 'components/app/deviceGroupDropdown';
import { ManageDeviceGroupsBtnContainer as ManageDeviceGroupsBtn } from 'components/app/manageDeviceGroupsBtn';
import { AjaxError, Btn, RefreshBar, PageContent, ContextMenu } from 'components/shared';
import { DeviceNewContainer } from './flyouts/deviceNew';
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

  openNewDeviceFlyout = () => this.setState({ openFlyoutName: 'new-device' });

  onContextMenuChange = contextBtns => this.setState({
    contextBtns,
    openFlyoutName: undefined
  });

  render() {
    const { t, devices, deviceGroupError, deviceError, isPending, lastUpdated, fetchDevices } = this.props;
    const gridProps = {
      rowData: isPending ? undefined : devices || [],
      onContextMenuChange: this.onContextMenuChange,
      t: this.props.t
    };
    const newDeviceFlyoutOpen = this.state.openFlyoutName === 'new-device';

    const error = deviceGroupError || deviceError;

    return [
      <ContextMenu key="context-menu">
        <DeviceGroupDropdown />
        { this.state.contextBtns }
        <Btn svg={svgs.plus} onClick={this.openNewDeviceFlyout}>{t('devices.flyouts.new.contextMenuName')}</Btn>
        <ManageDeviceGroupsBtn />
      </ContextMenu>,
      <PageContent className="devices-container" key="page-content">
        <RefreshBar refresh={fetchDevices} time={lastUpdated} isPending={isPending} t={t} />
        { !!error && <AjaxError t={t} error={error} /> }
        { !error && <DevicesGrid {...gridProps} /> }
        { newDeviceFlyoutOpen && <DeviceNewContainer onClose={this.closeFlyout} /> }
      </PageContent>
    ];
  }
}
