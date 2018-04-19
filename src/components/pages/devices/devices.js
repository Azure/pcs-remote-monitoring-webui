// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { DevicesGrid } from './devicesGrid';
import { DeviceGroupDropdownContainer as DeviceGroupDropdown } from 'components/app/deviceGroupDropdown';
import { AjaxError, Btn, RefreshBar, PageContent, ContextMenu } from 'components/shared';
import { DeviceDetailsContainer } from './flyouts/deviceDetails';
import { DeviceNewContainer } from './flyouts/deviceNew';
import { svgs } from 'utilities';

import './devices.css';

const closedFlyoutState = {
  openFlyoutName: undefined,
  selectedDeviceId: undefined
};

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

  changeDeviceGroup = () => {
    const { changeDeviceGroup, deviceGroups } = this.props;
    changeDeviceGroup(deviceGroups[1].id);
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  openNewDeviceFlyout = () => this.setState({ openFlyoutName: 'new-device' });

  onSoftSelectChange = ({ id }) => this.setState({
    openFlyoutName: 'details',
    selectedDeviceId: id
  });

  onContextMenuChange = contextBtns => this.setState({
    contextBtns,
    openFlyoutName: undefined
  });

  getSoftSelectId = ({ id }) => id;

  render() {
    const { t, devices, error, isPending, lastUpdated, entities, fetchDevices } = this.props;
    const gridProps = {
      rowData: isPending ? undefined : devices || [],
      onSoftSelectChange: this.onSoftSelectChange,
      onContextMenuChange: this.onContextMenuChange,
      softSelectId: this.state.selectedDeviceId,
      getSoftSelectId: this.getSoftSelectId,
      t: this.props.t
    };
    const detailsFlyoutOpen = this.state.openFlyoutName === 'details';
    const newDeviceFlyoutOpen = this.state.openFlyoutName === 'new-device';

    return [
      <ContextMenu key="context-menu">
        <DeviceGroupDropdown />
        { this.state.contextBtns }
        <Btn svg={svgs.plus} onClick={this.openNewDeviceFlyout}>{t('devices.flyouts.new.contextMenuName')}</Btn>
      </ContextMenu>,
      <PageContent className="devices-container" key="page-content">
        <RefreshBar refresh={fetchDevices} time={lastUpdated} isPending={isPending} t={t} />
        { !!error && <AjaxError t={t} error={error} /> }
        { !error && <DevicesGrid {...gridProps} /> }
        { detailsFlyoutOpen && <DeviceDetailsContainer onClose={this.closeFlyout} device={entities[this.state.selectedDeviceId]} /> }
        { newDeviceFlyoutOpen && <DeviceNewContainer onClose={this.closeFlyout} /> }
      </PageContent>
    ];
  }
}
