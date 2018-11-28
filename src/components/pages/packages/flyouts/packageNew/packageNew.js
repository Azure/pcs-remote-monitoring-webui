// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from "react-router-dom";

import {
  packageTypeOptions,
  packagesEnum,
  configTypeOptions,
  configsEnum,
  toSinglePropertyDiagnosticsModel,
  toDiagnosticsModel
} from 'services/models';
import { svgs, LinkedComponent, Validator, getPackageTypeTranslation, getConfigTypeTranslation } from 'utilities';
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
  FormControl,
  FormGroup,
  FormLabel,
  SummaryBody,
  SectionDesc,
  SummaryCount,
  SummarySection,
  Svg
} from 'components/shared';

import './packageNew.css';

const fileInputAccept = ".json,application/json";

export class PackageNew extends LinkedComponent {
  constructor(props) {
    super(props);

    this.state = {
      packageType: undefined,
      configType: '',
      customConfigName: '',
      packageFile: undefined,
      changesApplied: undefined,
      fileError: undefined
    };
  }

  componentWillUnmount() {
    this.props.resetPackagesPendingError();
  }

  apply = (event) => {
    event.preventDefault();
    const { createPackage } = this.props;
    const { packageType, configType, customConfigName, packageFile, fileError } = this.state;

    // If configType is 'Custom' concatenate 'Custom' with customConfigName.
    let configName = '';
    if (configType === configsEnum.custom) configName = `${configsEnum.custom} - ${customConfigName}`;
    else configName = configType;

    this.props.logEvent(
      toDiagnosticsModel(
        'NewPackage_Apply',
        {
          packageType,
          packageName: packageFile.name
        })
    );
    if (this.formIsValid() && !fileError) {
      createPackage({ packageType: packageType, configType: configName, packageFile: packageFile });
      this.setState({ changesApplied: true, configType: configName });
    }
  }

  packageTypeChange = ({ target: { value: { value = {} } } }) => {
    this.props.logEvent(toSinglePropertyDiagnosticsModel('NewPackage_PackageTypeClick', 'PackageType', value));
    this.setState({ configType: '', customConfigType: '' });
    if (value === packagesEnum.deviceConfiguration) this.props.fetchConfigTypes();
  }

  configTypeChange = ({ target: { value: { value = {} } } }) => {
    this.props.logEvent(toSinglePropertyDiagnosticsModel('NewPackage_ConfigTypeClick', 'ConfigType', value));
    this.setState({ customConfigType: '' });
  }

  customConfigNameChange = ({ target: { value = {} } }) => {
    this.props.logEvent(toSinglePropertyDiagnosticsModel('NewPackage_CustomConfigType', 'customConfigName', value));
  }

  onFileSelected = (e) => {
    let file = e.target.files[0];
    if (file.name.length > 50) {
      this.setState({ fileError: this.props.t('packages.flyouts.new.validation.fileName') });
      return;
    }

    if (file.type !== 'application/json') {
      this.setState({ fileError: this.props.t('packages.flyouts.new.validation.fileType') });
      return;
    }

    this.setState({ packageFile: file, fileError: undefined });
    this.props.logEvent(toSinglePropertyDiagnosticsModel('NewPackage_FileSelect', 'FileName', file.name));
  }

  formIsValid = () => {
    return [
      this.packageTypeLink,
    ].every(link => !link.error);
  }

  genericCloseClick = (eventName) => {
    const { onClose, logEvent } = this.props;
    logEvent(toDiagnosticsModel(eventName, {}));
    onClose();
  }

  onKeyEvent = (event) => {
    if (event.keyCode === 32 || event.keyCode === 13) {
      event.preventDefault();
      this.inputElement.click();
    }
  }

  render() {
    const { t,
      isPending,
      error,
      configTypes,
      configTypesError,
      configTypesIsPending } = this.props;
    const {
      packageType,
      configType,
      packageFile,
      changesApplied,
      fileError } = this.state;

    const summaryCount = 1;
    const packageOptions = packageTypeOptions.map(value => ({
      label: getPackageTypeTranslation(value, t),
      value
    }));
    const configTypesUnion = configTypes ? [...new Set([...configTypes, ...configTypeOptions])] : configTypeOptions;
    const configOptions = configTypesUnion.map(value => ({
      label: getConfigTypeTranslation(value, t),
      value
    }))

    const completedSuccessfully = changesApplied && !error && !isPending;
    // Validators
    const requiredValidator = (new Validator()).check(Validator.notEmpty, t('packages.flyouts.new.validation.required'));

    // Links
    this.packageTypeLink = this.linkTo('packageType').map(({ value }) => value).withValidator(requiredValidator);
    this.configTypeLink = this.linkTo('configType')
      .map(({ value }) => value)
      .check(
        // Validate for non-empty value if packageType is of type 'Device Configuration'
        configValue => this.packageTypeLink.value === packagesEnum.deviceConfiguration ? Validator.notEmpty(configValue) : true,
        this.props.t('packages.flyouts.new.validation.required')
      );
    this.customConfigNameLink = this.linkTo('customConfigName')
      .check(
        // Validate for non-empty value if configType is of type 'Custom'
        customConfigValue => this.configTypeLink.value === configsEnum.custom ? Validator.notEmpty(customConfigValue) : true,
        this.props.t('packages.flyouts.new.validation.required')
      )
      .check(customConfigValue => customConfigValue.length <= 50, this.props.t('packages.flyouts.new.validation.customConfig'));

    const configTypeEnabled = this.packageTypeLink.value === packagesEnum.deviceConfiguration;
    const customTextVisible = configTypeEnabled && this.configTypeLink.value === configsEnum.custom;

    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('packages.flyouts.new.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={() => this.genericCloseClick('NewPackage_CloseClick')} />
        </FlyoutHeader>
        <FlyoutContent className="new-package-content">
          <form className="new-package-form" onSubmit={this.apply}>
            <div className="new-package-header">{t('packages.flyouts.new.header')}</div>
            <div className="new-package-descr">{t('packages.flyouts.new.description')}</div>

            <FormGroup>
              <FormLabel isRequired="true">{t('packages.flyouts.new.packageType')}</FormLabel>
              {
                !completedSuccessfully &&
                <FormControl
                  type="select"
                  className="long"
                  onChange={this.packageTypeChange}
                  link={this.packageTypeLink}
                  options={packageOptions}
                  placeholder={t('packages.flyouts.new.packageTypePlaceholder')}
                  clearable={false}
                  searchable={false} />
              }
              {
                completedSuccessfully && <FormLabel className="new-package-success-labels">{packageType}</FormLabel>
              }
            </FormGroup>
            {
              configTypeEnabled &&
              <FormGroup>
                <FormLabel isRequired="true">{t('packages.flyouts.new.configType')}</FormLabel>
                {!completedSuccessfully &&
                  <FormControl
                    type="select"
                    className="long"
                    onChange={this.configTypeChange}
                    link={this.configTypeLink}
                    options={configOptions}
                    placeholder={t('packages.flyouts.new.configTypePlaceholder')}
                    clearable={false}
                    searchable={false} />
                }
                {configTypesIsPending && <Indicator />}
                {
                  /** Displays an error message if one occurs while fetching configTypes. */
                  configTypesError && <AjaxError className="new-package-flyout-error" t={t} error={configTypesError} />
                }
                {
                  completedSuccessfully && <FormLabel className="new-package-success-labels">{configType}</FormLabel>
                }
              </FormGroup>
            }
            {
              !completedSuccessfully && customTextVisible &&
              <FormGroup>
                <FormLabel isRequired="true">{t('packages.flyouts.new.customType')}</FormLabel>
                <FormControl
                  type="text"
                  className="long"
                  onBlur={this.customConfigNameChange}
                  link={this.customConfigNameLink}
                  placeholder={t('packages.flyouts.new.customTextPlaceholder')} />
              </FormGroup>
            }
            {
              !completedSuccessfully &&
              <div className="new-package-upload-container">
                <label htmlFor="hidden-input-id" className="new-package-browse-click">
                  <span
                    role="button"
                    aria-controls="hidden-input-id"
                    tabIndex="0"
                    onKeyUp={this.onKeyEvent}>
                    {t('packages.flyouts.new.browse')}
                  </span>
                </label>
                <input
                  type="file"
                  id="hidden-input-id"
                  accept={fileInputAccept}
                  ref={input => this.inputElement = input}
                  className="new-package-hidden-input"
                  onChange={this.onFileSelected} />
                {t('packages.flyouts.new.browseText')}
              </div>
            }
            {fileError && <AjaxError className="new-package-flyout-error" t={t} error={{ message: fileError }} />}

            <SummarySection className="new-package-summary">
              <SummaryBody>
                {packageFile && <SummaryCount>{summaryCount}</SummaryCount>}
                {packageFile && <SectionDesc>{t('packages.flyouts.new.package')}</SectionDesc>}
                {isPending && <Indicator />}
                {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
              </SummaryBody>
              {packageFile && <div className="new-package-file-name">{packageFile.name}</div>}
              {
                completedSuccessfully &&
                <div className="new-package-deployment-text">
                  <Trans i18nKey={"packages.flyouts.new.deploymentText"}>
                    To deploy packages, go to the
                    <Link className="new-package-deployment-page-link" to={'/deployments'}>{t('packages.flyouts.new.deploymentsPage')}</Link>
                    , and then click
                      <strong>{t('packages.flyouts.new.newDeployment')}</strong>
                    .
                    </Trans>
                </div>
              }
              {/** Displays an error message if one occurs while applying changes. */
                error && <AjaxError className="new-package-flyout-error" t={t} error={error} />
              }
              {
                /** If package is selected, show the buttons for uploading and closing the flyout. */
                (packageFile && !completedSuccessfully) &&
                <BtnToolbar>
                  <Btn svg={svgs.upload} primary={true} disabled={isPending || !this.formIsValid()} type="submit">{t('packages.flyouts.new.upload')}</Btn>
                  <Btn svg={svgs.cancelX} onClick={() => this.genericCloseClick('NewPackage_CancelClick')}>
                    {t('packages.flyouts.new.cancel')}
                  </Btn>
                </BtnToolbar>
              }
              {
                /** If package is not selected, show only the cancel button. */
                (!packageFile) &&
                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={() => this.genericCloseClick('NewPackage_CancelClick')}>
                    {t('packages.flyouts.new.cancel')}
                  </Btn>
                </BtnToolbar>
              }
              {
                /** After successful upload, show close button. */
                (completedSuccessfully) &&
                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={() => this.genericCloseClick('NewPackage_CancelClick')}>
                    {t('packages.flyouts.new.close')}
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
