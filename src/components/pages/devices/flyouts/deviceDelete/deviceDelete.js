// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Observable } from 'rxjs';

import { IoTHubManagerService } from 'services';
import { svgs } from 'utilities';
import { permissions } from 'services/models';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent,
  Indicator,
  Protected,
  SectionDesc,
  SectionHeader,
  SummaryBody,
  SummaryCount,
  SummarySection,
  Svg,
  ToggleBtn
} from 'components/shared';

import './deviceDelete.css';

export class DeviceDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      physicalDevices: [],
      containsSimulatedDevices: false,
      confirmStatus: false,
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

  toggleConfirm = ({ target: { value } }) => {
    if (this.state.changesApplied) {
      this.setState({ confirmStatus: value, changesApplied: false, successCount: 0 });
    } else {
      this.setState({ confirmStatus: value });
    }
  }

  deleteDevices = (event) => {
    event.preventDefault();
    this.setState({ isPending: true, error: null });

    this.subscription = Observable.from(this.state.physicalDevices)
      .flatMap(({ id }) =>
        IoTHubManagerService.deleteDevice(id)
          .map(() => id)
      )
      .subscribe(
        deletedDeviceId => {
          this.setState({ successCount: this.state.successCount + 1 });
          this.props.deleteDevices([deletedDeviceId]);
        },
        error => this.setState({ error, isPending: false, changesApplied: true }),
        () => this.setState({ isPending: false, changesApplied: true, confirmStatus: false })
      );
  }

  getSummaryMessage() {
    const { t } = this.props;
    const { isPending, changesApplied } = this.state;

    if (isPending) {
      return t('devices.flyouts.delete.pending');
    } else if (changesApplied) {
      return t('devices.flyouts.delete.applySuccess');
    } else {
      return t('devices.flyouts.delete.affected');
    }
  }

  render() {
    const { t, onClose } = this.props;
    const {
      physicalDevices,
      containsSimulatedDevices,
      confirmStatus,
      isPending,
      error,
      successCount,
      changesApplied
    } = this.state;

    const summaryCount = changesApplied ? successCount : physicalDevices.length;
    const completedSuccessfully = changesApplied && !error;
    const summaryMessage = this.getSummaryMessage();

    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('devices.flyouts.delete.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          <Protected permission={permissions.deleteDevices}>
            <form className="device-delete-container" onSubmit={this.deleteDevices}>
              <div className="device-delete-header">{t('devices.flyouts.delete.header')}</div>
              <div className="device-delete-descr">{t('devices.flyouts.delete.description')}</div>
              <ToggleBtn
                value={confirmStatus}
                onChange={this.toggleConfirm}>
                {confirmStatus ? t('devices.flyouts.delete.confirmYes') : t('devices.flyouts.delete.confirmNo')}
              </ToggleBtn>
              {
                containsSimulatedDevices &&
                <div className="simulated-device-selected">
                  <Svg path={svgs.infoBubble} className="info-icon" />
                  {t('devices.flyouts.delete.simulatedNotSupported')}
                </div>
              }

              <SummarySection>
                <SectionHeader>{t('devices.flyouts.delete.summaryHeader')}</SectionHeader>
                <SummaryBody>
                  <SummaryCount>{summaryCount}</SummaryCount>
                  <SectionDesc>{summaryMessage}</SectionDesc>
                  {this.state.isPending && <Indicator />}
                  {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
                </SummaryBody>
              </SummarySection>

              {error && <AjaxError className="device-delete-error" t={t} error={error} />}
              {
                !changesApplied &&
                <BtnToolbar>
                  <Btn svg={svgs.trash} primary={true} disabled={isPending || physicalDevices.length === 0 || !confirmStatus} type="submit">{t('devices.flyouts.delete.apply')}</Btn>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.delete.cancel')}</Btn>
                </BtnToolbar>
              }
              {
                !!changesApplied &&
                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.delete.close')}</Btn>
                </BtnToolbar>
              }
            </form>
          </Protected>
        </FlyoutContent>
      </Flyout>
    );
  }
}
