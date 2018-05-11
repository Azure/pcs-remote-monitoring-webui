// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import update from 'immutability-helper';

import { DeviceSimulationService, IoTHubManagerService } from 'services';
import { authenticationTypeOptions, toNewDeviceRequestModel } from 'services/models';
import {
  copyToClipboard,
  int,
  isEmptyObject,
  LinkedComponent,
  stringToBoolean,
  svgs,
  Validator
} from 'utilities';
import { Svg } from 'components/shared/svg/svg';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent,
  FormControl,
  FormGroup,
  FormLabel,
  FormSection,
  Indicator,
  Radio,
  SectionDesc,
  SectionHeader,
  SummaryBody,
  SummaryCount,
  SummarySection
} from 'components/shared';

import './deviceNew.css';

const isIntRegex = /^-?\d*$/;
const nonInteger = x => !x.match(isIntRegex);
const stringToInt = x => x === '' || x === '-' ? x : int(x);

const deviceTypeOptions = {
  labelName: 'devices.flyouts.new.deviceType.label',
  simulated: {
    labelName: 'devices.flyouts.new.deviceType.simulated',
    value: true
  },
  physical: {
    labelName: 'devices.flyouts.new.deviceType.physical',
    value: false
  }
};

const deviceIdTypeOptions = {
  labelName: 'devices.flyouts.new.deviceId.label',
  manual: {
    hintName: 'devices.flyouts.new.deviceId.hint',
    value: false
  },
  generate: {
    labelName: 'devices.flyouts.new.deviceId.sysGenerated',
    value: true
  }
};

const authTypeOptions = {
  labelName: 'devices.flyouts.new.authenticationType.label',
  symmetric: {
    labelName: 'devices.flyouts.new.authenticationType.symmetric',
    value: authenticationTypeOptions.symmetric
  },
  x509: {
    labelName: 'devices.flyouts.new.authenticationType.x509',
    value: authenticationTypeOptions.x509
  }
};

const authKeyTypeOptions = {
  labelName: 'devices.flyouts.new.authenticationKey.label',
  generate: {
    labelName: 'devices.flyouts.new.authenticationKey.generateKeys',
    value: true
  },
  manual: {
    labelName: 'devices.flyouts.new.authenticationKey.manualKeys',
    value: false
  }
};

const DeviceDetail = ({ label, value }) => (
  <FormSection className="device-detail">
    <SectionHeader>{label}</SectionHeader>
    <div className="device-detail-contents">
      <div className="device-detail-value">{value}</div>
      <Svg className="copy-icon" path={svgs.copy} onClick={() => copyToClipboard(value)} />
    </div>
  </FormSection>
);

const DeviceConnectionString = ({ label, deviceId, hostName, sharedAccessKey }) => (
  <DeviceDetail label={label} value={`HostName=${hostName};DeviceId=${deviceId};SharedAccessKey=${sharedAccessKey}`} />
);

const ProvisionedDevice = ({ device, t }) => {
  // When an error occurs, the device has no data... and so there is nothing to display here.
  if (isEmptyObject(device)) return null;

  const {
    id,
    iotHubHostName: hostName,
    authentication: { primaryKey },
    authentication: { secondaryKey }
  } = device;

  return (
    <div>
      <DeviceDetail label={t('devices.flyouts.new.deviceId.label')} value={id} />
      <DeviceDetail label={t('devices.flyouts.new.authenticationKey.primaryKey')} value={primaryKey} />
      <DeviceDetail label={t('devices.flyouts.new.authenticationKey.secondaryKey')} value={secondaryKey} />
      <DeviceConnectionString label={t('devices.flyouts.new.authenticationKey.primaryKeyConnection')} deviceId={id} hostName={hostName} sharedAccessKey={primaryKey} />
      <DeviceConnectionString label={t('devices.flyouts.new.authenticationKey.secondaryKeyConnection')} deviceId={id} hostName={hostName} sharedAccessKey={secondaryKey} />
    </div>
  );
};

export class DeviceNew extends LinkedComponent {
  constructor(props) {
    super(props);

    this.state = {
      isPending: false,
      error: undefined,
      successCount: 0,
      changesApplied: false,
      formData: {
        count: 1,
        deviceId: '',
        isGenerateId: deviceIdTypeOptions.manual.value,
        isSimulated: deviceTypeOptions.simulated.value,
        deviceModel: undefined,
        authenticationType: authTypeOptions.symmetric.value,
        isGenerateKeys: authKeyTypeOptions.generate.value,
        primaryKey: undefined,
        secondaryKey: undefined
      },
      provisionedDevice: {}
    };

    if (props.deviceModelOptions === undefined) {
      props.fetchDeviceModelOptions();
    }

    // Linked components
    this.formDataLink = this.linkTo('formData');

    this.deviceTypeLink = this.formDataLink.forkTo('isSimulated')
      .map(stringToBoolean);

    this.countLink = this.formDataLink.forkTo('count')
      .reject(nonInteger)
      .map(stringToInt)
      .check(Validator.notEmpty, () => this.props.t('devices.flyouts.new.validation.required'))
      .check(num => num > 0, () => this.props.t('devices.flyouts.new.validation.greaterThanZero'));

    this.isGenerateIdLink = this.formDataLink.forkTo('isGenerateId')
      .map(stringToBoolean);

    this.deviceIdLink = this.formDataLink.forkTo('deviceId')
      .check(
        devId => (!this.deviceTypeLink.value && !this.isGenerateIdLink.value ? Validator.notEmpty(devId) : true),
        () => this.props.t('devices.flyouts.new.validation.required')
      );

    this.deviceModelLink = this.formDataLink.forkTo('deviceModel')
      .map(({ value }) => value)
      .check(
        devModel => this.deviceTypeLink.value ? Validator.notEmpty(devModel) : true,
        () => this.props.t('devices.flyouts.new.validation.required')
      );

    this.authenticationTypeLink = this.formDataLink.forkTo('authenticationType')
      .reject(nonInteger)
      .map(stringToInt);

    this.isGenerateKeysLink = this.formDataLink.forkTo('isGenerateKeys')
      .map(stringToBoolean);

    this.primaryKeyLink = this.formDataLink.forkTo('primaryKey')
      .check(
        priKey => (!this.deviceTypeLink.value && !this.isGenerateKeysLink.value ? Validator.notEmpty(priKey) : true),
        () => this.props.t('devices.flyouts.new.validation.required')
      );

    this.secondaryKeyLink = this.formDataLink.forkTo('secondaryKey')
      .check(
        secKey => (!this.deviceTypeLink.value && !this.isGenerateKeysLink.value ? Validator.notEmpty(secKey) : true),
        () => this.props.t('devices.flyouts.new.validation.required')
      );
  }

  componentWillUnmount() {
    if (this.provisionSubscription) this.provisionSubscription.unsubscribe();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { formData } = nextState;

    // When the device type is Physical, only allow 1 to be created
    if (formData.isSimulated === deviceTypeOptions.physical.value && formData.count !== 1) {
      this.setState(update(nextState, {
        formData: { count: { $set: 1 } }
      }));
    }

    // When the authentication type is X.509, ensure keys to be entered manually
    if (formData.authenticationType === authTypeOptions.x509.value && formData.isGenerateKeys !== authKeyTypeOptions.manual.value) {
      this.setState(update(nextState, {
        formData: { isGenerateKeys: { $set: authKeyTypeOptions.manual.value } }
      }));
    }

    // Update normally
    return true;
  }

  formIsValid() {
    return [
      this.deviceTypeLink,
      this.countLink,
      this.deviceIdLink,
      this.isGenerateIdLink,
      this.deviceModelLink,
      this.authenticationTypeLink,
      this.isGenerateKeysLink,
      this.primaryKeyLink,
      this.secondaryKeyLink
    ].every(link => !link.error);
  }

  apply = (event) => {
    event.preventDefault();
    const { formData } = this.state;

    if (this.formIsValid()) {
      this.setState({ isPending: true });

      if (this.provisionSubscription) this.provisionSubscription.unsubscribe();

      if (this.state.formData.isSimulated) {
        this.provisionSubscription = DeviceSimulationService.incrementSimulatedDeviceModel(formData.deviceModel, formData.count)
          .subscribe(
            () => {
              this.setState({ successCount: formData.count, isPending: false, changesApplied: true });
              this.props.fetchDevices();
            },
            error => {
              this.setState({ error, isPending: false, changesApplied: true });
            }
          );

      } else {
        this.provisionSubscription = IoTHubManagerService.provisionDevice(toNewDeviceRequestModel(formData))
          .subscribe(
            provisionedDevice => {
              this.setState({ provisionedDevice, successCount: formData.count, isPending: false, changesApplied: true });
              this.props.insertDevice(provisionedDevice);
            },
            error => {
              this.setState({ error, isPending: false, changesApplied: true });
            }
          );
      }
    }
  }

  getSummaryMessage() {
    const { t } = this.props;
    const { isPending, changesApplied } = this.state;

    if (isPending) {
      return t('devices.flyouts.new.pending');
    } else if (changesApplied) {
      return t('devices.flyouts.new.applySuccess');
    } else {
      return t('devices.flyouts.new.affected');
    }
  }

  render() {
    const {
      t,
      onClose,
      deviceModelOptions
    } = this.props;
    const {
      formData,
      provisionedDevice,
      isPending,
      error,
      successCount,
      changesApplied
    } = this.state;

    const isGenerateId = this.isGenerateIdLink.value === deviceIdTypeOptions.generate.value;
    const deviceName = this.deviceModelLink.value || t('devices.flyouts.new.deviceIdExample.deviceName');
    const isSimulatedDevice = this.deviceTypeLink.value === deviceTypeOptions.simulated.value;
    const isX509 = this.authenticationTypeLink.value === authTypeOptions.x509.value;
    const isGenerateKeys = this.isGenerateKeysLink.value === authKeyTypeOptions.generate.value;
    const summaryCount = changesApplied ? successCount : formData.count;
    const completedSuccessfully = changesApplied && successCount === formData.count;
    const summaryMessage = this.getSummaryMessage();

    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('devices.flyouts.new.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          <form className="devices-new-container" onSubmit={this.apply}>
            <div className="devices-new-content">
              <FormGroup>
                <FormLabel>{t(deviceTypeOptions.labelName)}</FormLabel>
                <Radio link={this.deviceTypeLink} value={deviceTypeOptions.simulated.value}>
                  {t(deviceTypeOptions.simulated.labelName)}
                </Radio>
                <Radio link={this.deviceTypeLink} value={deviceTypeOptions.physical.value}>
                  {t(deviceTypeOptions.physical.labelName)}
                </Radio>
              </FormGroup>
              {
                isSimulatedDevice && [
                  <FormGroup key="deviceCount">
                    <FormLabel>{t('devices.flyouts.new.count.label')}</FormLabel>
                    <FormControl link={this.countLink} type="text" />
                  </FormGroup>,
                  <FormGroup key="deviceId">
                    <FormLabel>{t('devices.flyouts.new.deviceIdExample.label')}</FormLabel>
                    <div className="device-id-example">{t('devices.flyouts.new.deviceIdExample.format', { deviceName })}</div>
                  </FormGroup>,
                  <FormGroup key="deviceModel">
                    <FormLabel>{t('devices.flyouts.new.deviceModel.label')}</FormLabel>
                    <FormControl link={this.deviceModelLink} type="select" options={deviceModelOptions} placeholder={t('devices.flyouts.new.deviceModel.hint')} />
                  </FormGroup>
                ]
              }
              {
                !isSimulatedDevice && [
                  <FormGroup key="deviceCount">
                    <FormLabel>{t('devices.flyouts.new.count.label')}</FormLabel>
                    <div className="device-count">{this.countLink.value}</div>
                  </FormGroup>,
                  <FormGroup key="deviceId">
                    <FormLabel>{t('devices.flyouts.new.deviceId.label')}</FormLabel>
                    <Radio link={this.isGenerateIdLink} value={deviceIdTypeOptions.manual.value}>
                      <FormControl className="device-id" link={this.deviceIdLink} disabled={isGenerateId} type="text" placeholder={t(deviceIdTypeOptions.manual.hintName)} />
                    </Radio>
                    <Radio link={this.isGenerateIdLink} value={deviceIdTypeOptions.generate.value}>
                      {t(deviceIdTypeOptions.generate.labelName)}
                    </Radio>
                  </FormGroup>,
                  <FormGroup key="authType">
                    <FormLabel>{t(authTypeOptions.labelName)}</FormLabel>
                    <Radio link={this.authenticationTypeLink} value={authTypeOptions.symmetric.value}>
                      {t(authTypeOptions.symmetric.labelName)}
                    </Radio>
                    <Radio link={this.authenticationTypeLink} value={authTypeOptions.x509.value}>
                      {t(authTypeOptions.x509.labelName)}
                    </Radio>
                  </FormGroup>,
                  <FormGroup key="authKeyType">
                    <FormLabel>{t(authKeyTypeOptions.labelName)}</FormLabel>
                    <Radio link={this.isGenerateKeysLink} value={authKeyTypeOptions.generate.value} disabled={isX509}>
                      {t(authKeyTypeOptions.generate.labelName)}
                    </Radio>
                    <Radio link={this.isGenerateKeysLink} value={authKeyTypeOptions.manual.value}>
                      {t(authKeyTypeOptions.manual.labelName)}
                    </Radio>
                    <FormGroup className="sub-settings">
                      <FormLabel>{isX509 ? t('devices.flyouts.new.authenticationKey.primaryThumbprint') : t('devices.flyouts.new.authenticationKey.primaryKey')}</FormLabel>
                      <FormControl link={this.primaryKeyLink} disabled={isGenerateKeys} type="text" placeholder={t('devices.flyouts.new.authenticationKey.hint')} />
                    </FormGroup>
                    <FormGroup className="sub-settings">
                      <FormLabel>{isX509 ? t('devices.flyouts.new.authenticationKey.secondaryThumbprint') : t('devices.flyouts.new.authenticationKey.secondaryKey')}</FormLabel>
                      <FormControl link={this.secondaryKeyLink} disabled={isGenerateKeys} type="text" placeholder={t('devices.flyouts.new.authenticationKey.hint')} />
                    </FormGroup>
                  </FormGroup>
                ]
              }
            </div>
            <SummarySection>
              <SectionHeader>{t('devices.flyouts.new.summaryHeader')}</SectionHeader>
              <SummaryBody>
                <SummaryCount>{summaryCount || 0}</SummaryCount>
                <SectionDesc>{summaryMessage}</SectionDesc>
                {this.state.isPending && <Indicator />}
                {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
                {
                  /*
                  TODO: Change interaction pattern.
                  - Make the flyout stay open to give the user visual confirmation of success.
                  - For simulated devices, provide a message telling that the new devices may take a while to show up.
                  - Also, allow for additional devices to be created while the flyout is open.
                  */
                }
              </SummaryBody>
            </SummarySection>

            {error && <AjaxError className="devices-new-error" t={t} error={error} />}
            {
              !changesApplied &&
              <BtnToolbar>
                <Btn primary={true} disabled={isPending || !this.formIsValid()} type="submit">{t('devices.flyouts.new.apply')}</Btn>
                <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.new.cancel')}</Btn>
              </BtnToolbar>
            }
            {
              !!changesApplied && [
                <ProvisionedDevice key="provDevice" device={provisionedDevice} t={t} />,
                <BtnToolbar key="buttons">
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.new.close')}</Btn>
                </BtnToolbar>
              ]
            }
          </form>
        </FlyoutContent>
      </Flyout>
    );
  }
}
