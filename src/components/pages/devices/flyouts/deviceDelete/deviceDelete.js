// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Observable } from 'rxjs';

import { IoTHubManagerService } from 'services';
import { svgs } from 'utilities';
import {
  Btn,
  BtnToolbar,
  ErrorMsg,
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent,
  Indicator,
  Svg
} from 'components/shared';

import './deviceDelete.css';

export class DeviceDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      physicalDevices: [],
      containsSimulatedDevices: false,
      isPending: false,
      error: undefined,
      successCount: 0,
      changesApplied: false
    };
  }

  componentDidMount() {
    if (this.props.devices) {
      this.populateDevicesState(this.props.devices);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.devices && (this.props.devices || []).length !== nextProps.devices.length) {
      this.populateDevicesState(nextProps.devices);
    }
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  populateDevicesState = (devices = []) => {
    const physicalDevices = devices.filter(({ isSimulated }) => !isSimulated);
    this.setState({ physicalDevices, containsSimulatedDevices: (physicalDevices.length !== devices.length) });
  }

  deleteDevices = () => {
    this.setState({ isPending: true });

    this.subscription = Observable.from(this.state.physicalDevices)
      .flatMap(({ id }) =>
        IoTHubManagerService.deleteDevice(id)
          .map(() => id)
      )
      .subscribe(
        deletedDeviceId  => {
          this.setState({ successCount: this.state.successCount + 1 });
          this.props.deleteDevice(deletedDeviceId);
        },
        error => this.setState({ error, isPending: false, changesApplied: true }),
        () => this.setState({ isPending: false, changesApplied: true })
      );

  }

  render() {
    const { t, onClose } = this.props;
    const {
      physicalDevices,
      containsSimulatedDevices,
      isPending,
      error,
      successCount,
      changesApplied
    } = this.state;

    const summaryCount = changesApplied ? successCount : physicalDevices.length;
    const summaryMessage = changesApplied ? t('devices.delete.applySuccess') : t('devices.delete.affected');

    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('devices.delete.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          <div className="device-delete-container">
            <div className="device-delete-header">{t('devices.delete.header')}</div>
            <div className="device-delete-descr">{t('devices.delete.description')}</div>
            {
              containsSimulatedDevices &&
              <div className="simulated-device-selected">
                <Svg path={svgs.infoBubble} className="info-icon" />
                {t('devices.delete.simulatedNotSupported')}
              </div>
            }
            <div className="device-delete-summary-container">
              <div>
                Summary
              </div>
              <div className="device-delete-affected">
                <div className="device-delete-count">{summaryCount}</div>
                {summaryMessage}
              </div>
            </div>
            {
              error &&
              <div className="device-delete-error">
                <ErrorMsg>{error}</ErrorMsg>
              </div>
            }
            {
              !changesApplied &&
              <BtnToolbar className="tools-preApply">
                {this.state.isPending && <Indicator />}
                <Btn svg={svgs.trash} primary={true} disabled={isPending || physicalDevices.length === 0} onClick={this.deleteDevices}>{t('devices.delete.apply')}</Btn>
                <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.delete.cancel')}</Btn>
              </BtnToolbar>
            }
            {
              !!changesApplied &&
              <BtnToolbar className="tools-postApply">
                <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.delete.close')}</Btn>
              </BtnToolbar>
            }
          </div>
        </FlyoutContent>
      </Flyout>
    );
  }
}
