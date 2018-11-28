// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from "react-router-dom";

import Config from 'app.config';
import {
  packageTypeOptions,
  packagesEnum,
  toDiagnosticsModel,
  toSinglePropertyDiagnosticsModel
} from 'services/models';
import {
  svgs,
  LinkedComponent,
  Validator,
  getPackageTypeTranslation,
  getConfigTypeTranslation,
  themedPaths
} from 'utilities';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  ComponentArray,
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent,
  Hyperlink,
  Indicator,
  FormControl,
  FormGroup,
  FormLabel,
  SummaryBody,
  SectionDesc,
  SummaryCount,
  SummarySection,
  Svg,
  Tooltip,
  ThemedSvgContainer
} from 'components/shared';

import './deploymentNew.css';

const isPositiveInteger = (str) => /^\+?(0|[1-9]\d*)$/.test(str) && str <= 2147483647;

export class DeploymentNew extends LinkedComponent {
  constructor(props) {
    super(props);

    this.state = {
      packageType: '',
      configType: '',
      deviceGroupId: undefined,
      deviceGroupName: '',
      deviceGroupQuery: '',
      name: '',
      priority: '',
      packageId: undefined,
      packageName: '',
      targetedDeviceCount: '',
      changesApplied: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { devices, packages, deviceGroups } = nextProps;
    const { deviceGroupId, packageId } = this.state;
    if (devices && devices.length > 0) {
      this.setState({ targetedDeviceCount: devices.length });
    }
    if (deviceGroupId !== undefined) {
      const deviceGroupName = deviceGroups.find(deviceGroup => deviceGroup.id === deviceGroupId).displayName;
      this.setState({ deviceGroupName });
    }
    if (packageId !== undefined) {
      const packageName = packages.find(packageItem => packageItem.id === packageId).name;
      this.setState({ packageName });
    }
  }

  componentWillUnmount() {
    const { resetCreatePendingError, resetPackagesPendingError, resetDevicesPendingError } = this.props;
    resetCreatePendingError();
    resetPackagesPendingError();
    resetDevicesPendingError();
  }

  apply = (event) => {
    event.preventDefault();
    const { createDeployment, packages, logEvent } = this.props;
    const {
      packageName,
      deviceGroupName,
      deviceGroupQuery,
      deviceGroupId,
      name,
      priority,
      packageId,
      packageType,
      configType } = this.state;

    logEvent(
      toDiagnosticsModel(
        'NewDeployment_ApplyClick', {
          packageId,
          packageType,
          configType,
          priority,
          name,
          deviceGroupId,
          packageName,
        })
    );
    if (this.formIsValid()) {
      const packageContent = packages.find(packageObj => packageObj.id === packageId).content;
      createDeployment({
        packageType,
        configType,
        packageName,
        packageContent,
        packageId,
        deviceGroupName,
        deviceGroupQuery,
        deviceGroupId,
        name,
        priority
      });
      this.setState({ changesApplied: true });
    }
  }

  formIsValid = () => {
    return [
      this.packageTypeLink,
      this.nameLink,
      this.deviceGroupIdLink,
      this.priorityLink,
      this.packageIdLink
    ].every(link => !link.error);
  }

  onPackageTypeSelected = (e) => {
    const selectedPackageType = e.target.value.value;
    this.props.logEvent(
      toSinglePropertyDiagnosticsModel('NewDeployment_PackageTypeSelect', 'PackageType', selectedPackageType)
    );

    switch (selectedPackageType) {
      // case - Edge manifest
      case packagesEnum.edgeManifest:
        this.props.fetchPackages(packagesEnum.edgeManifest, '');
        this.setState({ configType: '', changesApplied: false, packageId: undefined, packageName: '' });
        break;
      // case - Device Configuration
      case packagesEnum.deviceConfiguration:
        this.props.fetchConfigTypes();
        this.formControlChange();
        break;
      default:
        break;
    }
  }

  configTypeChange = ({ target: { value: { value = {} } } }) => {
    this.props.logEvent(toSinglePropertyDiagnosticsModel('NewDeployment_ConfigTypeClick', 'ConfigType', value));
    this.props.fetchPackages(packagesEnum.deviceConfiguration, value);
    this.setState({ changesApplied: false, packageId: undefined, packageName: '' });
  }

  onDeviceGroupSelected = (e) => {
    const { fetchDevices, deviceGroups } = this.props;
    const selectedDeviceGroupId = e.target.value.value;
    this.props.logEvent(
      toSinglePropertyDiagnosticsModel('NewDeployment_DeviceGroupSelect', 'DeviceGroup', selectedDeviceGroupId)
    );
    const selectedDeviceGroup = deviceGroups.find(deviceGroup => deviceGroup.id === selectedDeviceGroupId);
    this.setState({ deviceGroupQuery: JSON.stringify(selectedDeviceGroup.conditions) });
    fetchDevices(selectedDeviceGroup.conditions);
  }

  formControlChange = () => {
    if (this.state.changesApplied) {
      this.setState({ changesApplied: false });
    }
  }

  toPackageSelectOption = ({ id, name }) => ({ label: name, value: id });

  toDeviceGroupSelectOption = ({ id, displayName }) => ({ label: displayName, value: id });

  genericCloseClick = (eventName) => {
    const { onClose, logEvent } = this.props;
    logEvent(toDiagnosticsModel(eventName, {}));
    onClose();
  }

  genericOnChange = (eventName, key, value) => {
    this.props.logEvent(
      toSinglePropertyDiagnosticsModel(eventName, key, value)
    );
    this.formControlChange();
  }

  render() {
    const {
      t,
      createIsPending,
      createError,
      packagesPending,
      packagesError,
      packages,
      deviceGroups,
      devicesPending,
      devicesError,
      createdDeploymentId,
      configTypes,
      configTypesError,
      configTypesIsPending } = this.props;
    const {
      name,
      packageType,
      configType,
      deviceGroupId,
      deviceGroupName,
      packageName,
      priority,
      targetedDeviceCount,
      changesApplied
    } = this.state;

    // Validators
    const requiredValidator = (new Validator()).check(Validator.notEmpty, t('deployments.flyouts.new.validation.required'));

    // Links
    this.packageTypeLink = this.linkTo('packageType').map(({ value }) => value).withValidator(requiredValidator);
    this.configTypeLink = this.linkTo('configType')
      .map(({ value }) => value)
      .check(
        // Validate for non-empty value if packageType is of type 'Device Configuration'
        configValue => this.packageTypeLink.value === packagesEnum.deviceConfiguration ? Validator.notEmpty(configValue) : true,
        this.props.t('deployments.flyouts.new.validation.required')
      );
    this.nameLink = this.linkTo('name')
      .withValidator(requiredValidator)
      .check(name => name.length <= 50, this.props.t('deployments.flyouts.new.validation.name'));
    this.deviceGroupIdLink = this.linkTo('deviceGroupId').map(({ value }) => value).withValidator(requiredValidator);
    this.priorityLink = this.linkTo('priority')
      .check(Validator.notEmpty, () => this.props.t('deployments.flyouts.new.validation.required'))
      .check(val => isPositiveInteger(val), t('deployments.flyouts.new.validation.positiveInteger'));
    this.packageIdLink = this.linkTo('packageId').map(({ value }) => value).withValidator(requiredValidator);

    const isPackageTypeSelected = packageType === packagesEnum.edgeManifest || (packageType !== '' && configType !== '');
    const isDeviceGroupSelected = deviceGroupId !== undefined;
    const packageOptions = packages.map(this.toPackageSelectOption);
    const deviceGroupOptions = deviceGroups.map(this.toDeviceGroupSelectOption);
    const packageTypeSelectOptions = packageTypeOptions.map(value => ({
      label: getPackageTypeTranslation(value, t),
      value
    }))
    const configTypeSelectOptions = configTypes ?
      configTypes.map(value => ({
        label: getConfigTypeTranslation(value, t),
        value
      }))
      : {};
    const completedSuccessfully = changesApplied && !createError && !createIsPending;
    const deviceFetchSuccessful = isDeviceGroupSelected && !devicesError && !devicesPending;
    const configTypeEnabled = this.packageTypeLink.value === packagesEnum.deviceConfiguration;

    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('deployments.flyouts.new.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={() => this.genericCloseClick('NewDeployment_CloseClick')} />
        </FlyoutHeader>
        <FlyoutContent className="new-deployment-content">
          <form className="new-deployment-form" onSubmit={this.apply}>
            <FormGroup className="new-deployment-formGroup">
              <FormLabel isRequired="true">{t('deployments.flyouts.new.name')}</FormLabel>
              {
                !completedSuccessfully &&
                <FormControl
                  type="text"
                  className="long"
                  link={this.nameLink}
                  onBlur={(event) => this.genericOnChange('NewDeployment_NameText', 'Name', event.target.value)}
                  placeholder={t('deployments.flyouts.new.namePlaceHolder')} />
              }
              {completedSuccessfully && <FormLabel className="new-deployment-success-labels">{name}</FormLabel>}
            </FormGroup>
            <FormGroup className="new-deployment-formGroup">
              <FormLabel isRequired="true">{t('deployments.flyouts.new.packageType')}</FormLabel>
              {
                !completedSuccessfully &&
                <FormControl
                  type="select"
                  className="long"
                  link={this.packageTypeLink}
                  onChange={this.onPackageTypeSelected}
                  options={packageTypeSelectOptions}
                  placeholder={t('deployments.flyouts.new.packageTypePlaceHolder')}
                  clearable={false}
                  searchable={false} />
              }
              {completedSuccessfully && <FormLabel className="new-deployment-success-labels">{packageType}</FormLabel>}
            </FormGroup>
            {
              configTypeEnabled &&
              <FormGroup className="new-deployment-formGroup">
                <FormLabel isRequired="true">{t('deployments.flyouts.new.configType')}</FormLabel>
                {
                  !completedSuccessfully &&
                  <FormControl
                    type="select"
                    className="long"
                    onChange={this.configTypeChange}
                    link={this.configTypeLink}
                    options={configTypeSelectOptions}
                    placeholder={t('deployments.flyouts.new.configTypePlaceHolder')}
                    clearable={false}
                    searchable={false} />
                }
                {configTypesIsPending && <Indicator />}
                {
                  /** Displays an error message if one occurs while fetching configTypes. */
                  configTypesError && <AjaxError className="new-deployment-flyout-error" t={t} error={configTypesError} />
                }
                {completedSuccessfully && <FormLabel className="new-deployment-success-labels">{configType}</FormLabel>}
              </FormGroup>
            }
            <FormGroup className="new-deployment-formGroup">
              <FormLabel isRequired="true">{t('deployments.flyouts.new.package')}</FormLabel>
              {
                !packagesPending && !completedSuccessfully &&
                <FormControl
                  type="select"
                  className="long"
                  disabled={!isPackageTypeSelected}
                  link={this.packageIdLink}
                  options={packageOptions}
                  onChange={(event) => this.genericOnChange('NewDeployment_PackageSelect', 'Package', event.target.value.value)}
                  placeholder={isPackageTypeSelected ? t('deployments.flyouts.new.packagePlaceHolder') : ""}
                  clearable={false}
                  searchable={false} />
              }
              {packagesPending && <Indicator />}
              {
                /** Displays an error message if one occurs while fetching packages. */
                packagesError && <AjaxError className="new-deployment-flyout-error" t={t} error={packagesError} />
              }
              {completedSuccessfully && <FormLabel className="new-deployment-success-labels">{packageName}</FormLabel>}
            </FormGroup>
            <FormGroup className="new-deployment-formGroup">
              <FormLabel isRequired="true">{t('deployments.flyouts.new.deviceGroup')}</FormLabel>
              {
                !completedSuccessfully &&
                <FormControl
                  type="select"
                  disabled={!isPackageTypeSelected}
                  className="long"
                  onChange={this.onDeviceGroupSelected}
                  link={this.deviceGroupIdLink}
                  options={deviceGroupOptions}
                  placeholder={isPackageTypeSelected ? t('deployments.flyouts.new.deviceGroupPlaceHolder') : ""}
                  clearable={false}
                  searchable={false} />
              }
              {completedSuccessfully && <FormLabel className="new-deployment-success-labels">{deviceGroupName}</FormLabel>}
            </FormGroup>
            <FormGroup className="new-deployment-formGroup">
              <FormLabel isRequired="true">
                {t('deployments.flyouts.new.priority')}
                <Tooltip content={
                  <Trans i18nKey={`deployments.flyouts.new.priorityToolTip`}>
                    Manual setup is required.
                      <Hyperlink href={Config.contextHelpUrls.deploymentPriority} target="_blank">{t('deployments.flyouts.new.priorityLearnMore')}</Hyperlink>
                  </Trans>
                }>
                  <ThemedSvgContainer paths={themedPaths.questionBubble} />
                </Tooltip>
              </FormLabel>
              {
                !completedSuccessfully &&
                <FormControl
                  type="text"
                  className="long"
                  link={this.priorityLink}
                  onBlur={(event) => this.genericOnChange('NewDeployment_PriorityNumber', 'Priority', event.target.value)}
                  placeholder={t('deployments.flyouts.new.priorityPlaceHolder')} />
              }
              {completedSuccessfully && <FormLabel className="new-deployment-success-labels">{priority}</FormLabel>}
            </FormGroup>
            <SummarySection className="new-deployment-summary">
              <SummaryBody>
                {
                  /** Displays targeted devices count once device goup is selected. */
                  deviceFetchSuccessful &&
                  <ComponentArray>
                    <SummaryCount> {targetedDeviceCount}</SummaryCount>
                    <SectionDesc>{t('deployments.flyouts.new.targetText')}</SectionDesc>
                    {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
                  </ComponentArray>
                }
                {
                  createIsPending &&
                  <ComponentArray>
                    <Indicator />
                    {t('deployments.flyouts.new.creating')}
                  </ComponentArray>
                }

              </SummaryBody>
              {
                /** Displays a info message if package type selected is edge Manifest */
                !changesApplied &&
                <div className="new-deployment-info-text">
                  <strong className="new-deployment-info-star">* </strong>
                  {t('deployments.flyouts.new.infoText')}
                </div>
              }
              {
                /** Displays a success message if deployment is created successfully */
                completedSuccessfully &&
                <div className="new-deployment-info-text">
                  <Trans i18nKey={"deployments.flyouts.new.successText"}>
                    View your deployment status detail for
                    <Link
                      className="new-deployment-detail-page-link"
                      to={`/deployments/${createdDeploymentId}`}>
                      {{ deploymentName: name }}
                    </Link>
                    .
                  </Trans>
                </div>
              }
              {
                /** Displays an error message if one occurs while creating deployment. */
                changesApplied && createError && <AjaxError className="new-deployment-flyout-error" t={t} error={createError} />
              }
              {
                /** If form is complete, show the buttons for creating a deployment and closing the flyout. */
                (!completedSuccessfully) &&
                <BtnToolbar>
                  <Btn primary={true} disabled={createIsPending || !this.formIsValid()} type="submit">{t('deployments.flyouts.new.apply')}</Btn>
                  <Btn svg={svgs.cancelX} onClick={() => this.genericCloseClick('NewDeployment_CancelClick')}>{
                    t('deployments.flyouts.new.cancel')}
                  </Btn>
                </BtnToolbar>
              }
              {
                /** After successful deployment creation, show only close button. */
                (completedSuccessfully) &&
                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={() => this.genericCloseClick('NewDeployment_CancelClick')}>
                    {t('deployments.flyouts.new.close')}
                  </Btn>
                </BtnToolbar>
              }
            </SummarySection>
          </form>
        </FlyoutContent>
      </Flyout>
    );
  }
}
