// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { packageTypeOptions } from 'services/models';
import { svgs, LinkedComponent, Validator } from 'utilities';
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
  Indicator,
  FormControl,
  FormGroup,
  FormLabel,
  SummaryBody,
  SectionDesc,
  SummaryCount,
  SummarySection,
  Svg
} from 'components/shared';

import './deploymentNew.css';

export class DeploymentNew extends LinkedComponent {
  constructor(props) {
    super(props);

    this.state = {
      packageType: undefined,
      deviceGroupId: undefined,
      deviceGroupName: '',
      name: '',
      priority: '',
      packageId: undefined,
      packageName: '',
      targetedDeviceCount: '',
      edgePackageSelected: false,
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
    const { createDeployment } = this.props;
    const { packageType, deviceGroupId, name, priority, packageId } = this.state;
    if (this.formIsValid()) {
      createDeployment({ 'type': packageType, deviceGroupId, name, priority, packageId });
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

  onPackageSelected = (e) => {
    switch (e.target.value.value) {
      // case Edge manifest
      case 'EdgeManifest':
        const { fetchPackages } = this.props;
        fetchPackages();
        this.setState({ edgePackageSelected: true });
        break;
      // other cases to be impletmented in Edge walk iteration
      default:
        break;
    }
    this.formControlChange();
  }

  onDeviceGroupSelected = (e) => {
    const { fetchDevices, deviceGroups } = this.props;
    const selectedDeviceGroupId = e.target.value.value;
    const selectedDeviceGroup = deviceGroups.find(deviceGroup => deviceGroup.id === selectedDeviceGroupId)
    fetchDevices(selectedDeviceGroup.conditions);
  }

  formControlChange = () => {
    if (this.state.changesApplied) {
      this.setState({ changesApplied: false });
    }
  }

  toPackageSelectOption = ({ id, name }) => ({ label: name, value: id });

  toDeviceGroupSelectOption = ({ id, displayName }) => ({ label: displayName, value: id });

  render() {
    const {
      t,
      onClose,
      createIsPending,
      createError,
      packagesPending,
      packagesError,
      packages,
      deviceGroups,
      devicesPending,
      devicesError
    } = this.props;
    const {
      name,
      packageType,
      deviceGroupId,
      deviceGroupName,
      packageName,
      priority,
      targetedDeviceCount,
      changesApplied,
      edgePackageSelected,
    } = this.state;

    // Validators
    const requiredValidator = (new Validator()).check(Validator.notEmpty, t('deployments.flyouts.new.validation.required'));

    // Links
    this.packageTypeLink = this.linkTo('packageType').map(({ value }) => value).withValidator(requiredValidator);
    this.nameLink = this.linkTo('name').withValidator(requiredValidator);
    this.deviceGroupIdLink = this.linkTo('deviceGroupId').map(({ value }) => value).withValidator(requiredValidator);
    this.priorityLink = this.linkTo('priority')
      .check(Validator.notEmpty, () => this.props.t('deployments.flyouts.new.validation.required'))
      .check(val => !isNaN(val), t('deployments.flyouts.new.validation.nan'));
    this.packageIdLink = this.linkTo('packageId').map(({ value }) => value).withValidator(requiredValidator);

    const isPackageTypeSelected = packageType !== undefined;
    const isDeviceGroupSelected = deviceGroupId !== undefined;
    const packageOptions = packages.map(this.toPackageSelectOption);
    const deviceGroupOptions = deviceGroups.map(this.toDeviceGroupSelectOption);
    const typeOptions = packageTypeOptions.map(value => ({
      label: t(`deployments.typeOptions.${value.toLowerCase()}`),
      value
    }));
    const completedSuccessfully = changesApplied && !createError && !createIsPending;
    const deviceFetchSuccessful = isDeviceGroupSelected && !devicesError && !devicesPending;

    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('deployments.flyouts.new.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
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
                  onChange={this.formControlChange}
                  placeholder={t('deployments.flyouts.new.namePlaceHolder')} />
              }
              {
                completedSuccessfully && <FormLabel className="new-deployment-success-labels">{name}</FormLabel>
              }
            </FormGroup>
            <FormGroup className="new-deployment-formGroup">
              <FormLabel isRequired="true">{t('deployments.flyouts.new.priority')}</FormLabel>
              {
                !completedSuccessfully &&
                <FormControl
                  type="text"
                  className="long"
                  link={this.priorityLink}
                  onChange={this.formControlChange}
                  placeholder={t('deployments.flyouts.new.priorityPlaceHolder')} />
              }
              {
                completedSuccessfully && <FormLabel className="new-deployment-success-labels">{priority}</FormLabel>
              }
            </FormGroup>
            <FormGroup className="new-deployment-formGroup">
              <FormLabel isRequired="true">{t('deployments.flyouts.new.type')}</FormLabel>
              {
                !completedSuccessfully &&
                <FormControl
                  type="select"
                  className="long"
                  link={this.packageTypeLink}
                  onChange={this.onPackageSelected}
                  options={typeOptions}
                  placeholder={t('deployments.flyouts.new.typePlaceHolder')}
                  clearable={false}
                  searchable={false} />
              }
              {
                completedSuccessfully && <FormLabel className="new-deployment-success-labels">{packageType}</FormLabel>
              }
            </FormGroup>
            <FormGroup className="new-deployment-formGroup">
              <FormLabel isRequired="true">{t('deployments.flyouts.new.package')}</FormLabel>
              {!packagesPending && !completedSuccessfully &&
                <FormControl
                  type="select"
                  className="long"
                  disabled={!isPackageTypeSelected}
                  link={this.packageIdLink}
                  options={packageOptions}
                  placeholder={isPackageTypeSelected ? t('deployments.flyouts.new.packagePlaceHolder') : ""}
                  clearable={false}
                  searchable={false} />
              }
              {
                packagesPending && <Indicator />
              }
              {/** Displays an error message if one occurs while fetching packages. */
                packagesError && <AjaxError className="new-deployment-flyout-error" t={t} error={packagesError} />
              }
              {
                completedSuccessfully && <FormLabel className="new-deployment-success-labels">{packageName}</FormLabel>
              }
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
              {
                completedSuccessfully && <FormLabel className="new-deployment-success-labels">{deviceGroupName}</FormLabel>
              }
            </FormGroup>
            <SummarySection className="new-deployment-summary">
              <SummaryBody>
                {/** Displays targeted devices count once device goup is selected. */
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
              {/** Displays a info message if package type selected is edge Manifest */
                !changesApplied && edgePackageSelected &&
                <div className="new-deployment-info-text">
                  {t('deployments.flyouts.new.infoText')}
                </div>
              }
              {/** Displays a success message if deployment is created successfully */
                completedSuccessfully &&
                <div className="new-deployment-info-text">
                  {t('deployments.flyouts.new.successText', { deplymentName: name })}
                </div>
              }
              {/** Displays an error message if one occurs while creating deployment. */
                changesApplied && createError && <AjaxError className="new-deployment-flyout-error" t={t} error={createError} />
              }
              {
                /** If form is complete, show the buttons for creating a deployment and closing the flyout. */
                (!completedSuccessfully) &&
                <BtnToolbar>
                  <Btn primary={true} disabled={createIsPending || !this.formIsValid()} type="submit">{t('deployments.flyouts.new.apply')}</Btn>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('deployments.flyouts.new.cancel')}</Btn>
                </BtnToolbar>
              }
              {
                /** After successful deployment creation, show only close button. */
                (completedSuccessfully) &&
                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('deployments.flyouts.new.close')}</Btn>
                </BtnToolbar>
              }
            </SummarySection>
          </form>
        </FlyoutContent>
      </Flyout>
    );
  }
}
