// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from "react-router-dom";

import {
  packageTypeOptions,
  toSinglePropertyDiagnosticsModel,
  toDiagnosticsModel
} from 'services/models';
import { svgs, LinkedComponent, Validator } from 'utilities';
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
      type: undefined,
      packageFile: undefined,
      changesApplied: undefined
    };
  }

  componentWillUnmount() {
    this.props.resetPackagesPendingError();
  }

  apply = (event) => {
    event.preventDefault();
    const { createPackage } = this.props;
    const { type, packageFile } = this.state;
    this.props.logEvent(
      toDiagnosticsModel(
        'NewPackage_Apply',
        {
          type,
          packageName: packageFile.name
        })
    );
    if (this.formIsValid()) {
      createPackage({ type: type, packageFile: packageFile });
      this.setState({ changesApplied: true });
    }
  }

  packageTypeChange = ({ target: { value: { value = {} } } }) => {
    this.props.logEvent(toSinglePropertyDiagnosticsModel('NewPackage_TypeClick', 'Type', value));
  }

  onFileSelected = (e) => {
    let file = e.target.files[0];
    this.setState({ packageFile: file });
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
    const { t, isPending, error } = this.props;
    const { type, packageFile, changesApplied } = this.state;

    const summaryCount = 1;
    const typeOptions = packageTypeOptions.map(value => ({
      label: t(`packages.typeOptions.${value.toLowerCase()}`),
      value
    }));

    const completedSuccessfully = changesApplied && !error && !isPending;
    // Validators
    const requiredValidator = (new Validator()).check(Validator.notEmpty, t('packages.flyouts.new.validation.required'));

    // Links
    this.packageTypeLink = this.linkTo('type').map(({ value }) => value).withValidator(requiredValidator);

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
              <FormLabel isRequired="true">{t('packages.flyouts.new.type')}</FormLabel>
              {
                !completedSuccessfully &&
                <FormControl
                  type="select"
                  className="long"
                  onChange={this.packageTypeChange}
                  link={this.packageTypeLink}
                  options={typeOptions}
                  placeholder={t('packages.flyouts.new.placeHolder')}
                  clearable={false}
                  searchable={false} />
              }
              {
                completedSuccessfully && <FormLabel className="new-package-success-labels">{type}</FormLabel>
              }
            </FormGroup>

            {
              !completedSuccessfully &&
              <div className="new-package-upload-container">
                <label htmlFor="hidden-input-id" className="new-package-browse-click">
                  <span
                    role="button"
                    aria-controls="hidden-input-id"
                    tabindex="0"
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
                    button.
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
