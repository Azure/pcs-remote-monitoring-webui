// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import update from 'immutability-helper';

import { IoTHubManagerService } from 'services';
import { AuthenticationTypeOptions, toNewDeviceRequestModel } from 'services/models';
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
  Btn,
  BtnToolbar,
  ErrorMsg,
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
  SummaryCount,
  SummarySection
} from 'components/shared';

import './deviceNew.css';

const isIntRegex = /^-?\d*$/;
const nonInteger = x => !x.match(isIntRegex);
const stringToInt = x => x === '' || x === '-' ? x : int(x);

const DeviceTypeOptions = {
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

const DeviceIdTypeOptions = {
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

const AuthTypeOptions = {
  labelName: 'devices.flyouts.new.authenticationType.label',
  symmetric: {
    labelName: 'devices.flyouts.new.authenticationType.symmetric',
    value: AuthenticationTypeOptions.symmetric
  },
  x509: {
    labelName: 'devices.flyouts.new.authenticationType.x509',
    value: AuthenticationTypeOptions.x509
  }
};

const AuthKeyTypeOptions = {
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
    ioTHubHostName: hostName,
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
        isGenerateId: DeviceIdTypeOptions.manual.value,
        isSimulated: DeviceTypeOptions.physical.value,
        deviceModel: undefined,
        authenticationType: AuthTypeOptions.symmetric.value,
        isGenerateKeys: AuthKeyTypeOptions.generate.value,
        primaryKey: undefined,
        secondaryKey: undefined
      },
      provisionedDevice: {}
    };

    // Linked components
    // TODO: Implement more extensive validation.
    // TODO: Translate validation messages... hopefully, in a way that doesn't require every form to duplicate the same messages.
    this.formDataLink = this.linkTo('formData');

    this.deviceTypeLink = this.formDataLink.forkTo('isSimulated')
      .map(stringToBoolean);

    this.countLink = this.formDataLink.forkTo('count')
      .reject(nonInteger)
      .map(stringToInt)
      .check(Validator.notEmpty, 'Number of devices is required.')
      .check(num => num > 0, 'Number of devices must be greater than zero.');

    this.deviceIdLink = this.formDataLink.forkTo('deviceId');

    this.isGenerateIdLink = this.formDataLink.forkTo('isGenerateId')
      .map(stringToBoolean);

    this.deviceModelLink = this.formDataLink.forkTo('deviceModel');

    this.authenticationTypeLink = this.formDataLink.forkTo('authenticationType')
      .reject(nonInteger)
      .map(stringToInt);

    this.isGenerateKeysLink = this.formDataLink.forkTo('isGenerateKeys')
      .map(stringToBoolean);

    this.primaryKeyLink = this.formDataLink.forkTo('primaryKey');

    this.secondaryKeyLink = this.formDataLink.forkTo('secondaryKey');
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { t } = nextProps;
    const { formData, isPending, changesApplied } = nextState;

    // When the device type is Physical, only allow 1 to be created
    if (formData.isSimulated === DeviceTypeOptions.physical.value && formData.count !== 1) {
      this.setState(update(nextState, {
        formData: { count: { $set: 1 } }
      }));
    }

    // When the authentication type is X.509, ensure keys to be entered manually
    if (formData.authenticationType === AuthTypeOptions.x509.value && formData.isGenerateKeys !== AuthKeyTypeOptions.manual.value) {
      this.setState(update(nextState, {
        formData: { isGenerateKeys: { $set: AuthKeyTypeOptions.manual.value } }
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

  apply = () => {
    if (this.formIsValid()) {
      this.setState({ isPending: true });

      this.subscription = IoTHubManagerService.provisionDevice(toNewDeviceRequestModel(this.state.formData))
        .subscribe(
          provisionedDevice => {
            this.setState({ provisionedDevice, successCount: this.state.formData.count, isPending: false, changesApplied: true });
            this.props.insertDevice(provisionedDevice);
          },
          errorResponse => {
            this.setState({ error: errorResponse.errorMessage, isPending: false, changesApplied: true });
          }
        );
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
    const { t, onClose } = this.props;
    const {
      formData,
      provisionedDevice,
      isPending,
      error,
      successCount,
      changesApplied
    } = this.state;

    const isGenerateId = this.isGenerateIdLink.value === DeviceIdTypeOptions.generate.value;
    const deviceName = this.deviceModelLink.value || t('devices.flyouts.new.deviceIdExample.deviceName');
    const isSimulatedDevice = this.deviceTypeLink.value === DeviceTypeOptions.simulated.value;
    const isX509 = this.authenticationTypeLink.value === AuthTypeOptions.x509.value;
    const isGenerateKeys = this.isGenerateKeysLink.value === AuthKeyTypeOptions.generate.value;
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
            <FormGroup>
              <FormLabel>{t(DeviceTypeOptions.labelName)}</FormLabel>
              <Radio link={this.deviceTypeLink} value={DeviceTypeOptions.simulated.value}>
                {t(DeviceTypeOptions.simulated.labelName)}
              </Radio>
              <Radio link={this.deviceTypeLink} value={DeviceTypeOptions.physical.value}>
                {t(DeviceTypeOptions.physical.labelName)}
              </Radio>
            </FormGroup>

            {
              isSimulatedDevice && [
                <FormGroup key="deviceCount">
                  <FormLabel>{t('devices.flyouts.new.count.label')}</FormLabel>
                  <FormControl link={this.countLink} type="number" />
                </FormGroup>,
                <FormGroup key="deviceId">
                  <FormLabel>{t('devices.flyouts.new.deviceIdExample.label')}</FormLabel>
                  <div className="device-id-example">{t('devices.flyouts.new.deviceIdExample.format', { deviceName })}</div>
                </FormGroup>,
                <FormGroup key="deviceModel">
                  <FormLabel>{t('devices.flyouts.new.deviceModel.label')}</FormLabel>
                  <div className="device-model-temp">{t('devices.flyouts.new.deviceModel.hint')} -- TODO: Add options</div>
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
                  <Radio link={this.isGenerateIdLink} value={DeviceIdTypeOptions.manual.value}>
                    <FormControl className="device-id" link={this.deviceIdLink} disabled={isGenerateId} type="text" placeholder={t(DeviceIdTypeOptions.manual.hintName)} />
                  </Radio>
                  <Radio link={this.isGenerateIdLink} value={DeviceIdTypeOptions.generate.value}>
                    {t(DeviceIdTypeOptions.generate.labelName)}
                  </Radio>
                </FormGroup>,
                <FormGroup key="authType">
                  <FormLabel >{t(AuthTypeOptions.labelName)}</FormLabel>
                  <Radio link={this.authenticationTypeLink} value={AuthTypeOptions.symmetric.value}>
                    {t(AuthTypeOptions.symmetric.labelName)}
                  </Radio>
                  <Radio link={this.authenticationTypeLink} value={AuthTypeOptions.x509.value}>
                    {t(AuthTypeOptions.x509.labelName)}
                  </Radio>
                </FormGroup>,
                <FormGroup key="authKeyType">
                  <FormLabel >{t(AuthKeyTypeOptions.labelName)}</FormLabel>
                  <Radio link={this.isGenerateKeysLink} value={AuthKeyTypeOptions.generate.value} disabled={isX509}>
                    {t(AuthKeyTypeOptions.generate.labelName)}
                  </Radio>
                  <Radio link={this.isGenerateKeysLink} value={AuthKeyTypeOptions.manual.value}>
                    {t(AuthKeyTypeOptions.manual.labelName)}
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
            <SummarySection title={t('devices.flyouts.new.summaryHeader')}>
              <SummaryCount>{summaryCount}</SummaryCount>
              <SectionDesc>{summaryMessage}</SectionDesc>
              {this.state.isPending && <Indicator />}
              {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
            </SummarySection>

            {
              error &&
              <ErrorMsg className="devices-new-error">{error}</ErrorMsg>
            }
            {
              !changesApplied &&
              <BtnToolbar>
                {/* TODO: Temporarily disable the Apply button for simulated devices. That'll be implemented in another PR. */}
                <Btn svg={svgs.trash} primary={true} disabled={isPending || !this.formIsValid() || isSimulatedDevice} onClick={this.apply}>{t('devices.flyouts.new.apply')}</Btn>
                <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.new.cancel')}</Btn>
              </BtnToolbar>
            }
            {
              !!changesApplied && [
                <ProvisionedDevice device={provisionedDevice} t={t} />,
                <BtnToolbar>
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
