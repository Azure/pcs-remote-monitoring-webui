// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { packageTypeOptions } from 'services/models';
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

  apply = (event) => {
    event.preventDefault();
    const { createPackage } = this.props;
    const { type, packageFile } = this.state;
    if (this.formIsValid()) {
      createPackage({ type: type, packageFile: packageFile });
      this.setState({ changesApplied: true });
    }
  }

  onFileSelected = (e) => {
    let file = e.target.files[0];
    this.setState({ packageFile: file });
  }

  formIsValid = () => {
    return [
      this.packageTypeLink,
    ].every(link => !link.error);
  }

  render() {
    const { t, onClose, isPending, error } = this.props;
    const { packageFile, changesApplied } = this.state;

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
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent className="new-package-content">
          <form className="new-package-form" onSubmit={this.apply}>
            <div className="new-package-header">{t('packages.flyouts.new.header')}</div>
            <div className="new-package-descr">{t('packages.flyouts.new.description')}</div>

            <FormGroup>
              <FormLabel isRequired="true">{t('packages.flyouts.new.type')}</FormLabel>
              <FormControl
                type="select"
                className="long"
                link={this.packageTypeLink}
                options={typeOptions}
                placeholder={t('packages.flyouts.new.placeHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>

            <div className="new-package-upload-container">
              <label htmlFor="hidden-input-id" className="new-package-browse-click">
                {t('packages.flyouts.new.browse')}
              </label>
              <input
                type="file"
                id="hidden-input-id"
                accept={fileInputAccept}
                className="new-package-hidden-input"
                onChange={this.onFileSelected} />
              {t('packages.flyouts.new.browseText')}
            </div>

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
                  {t('packages.flyouts.new.deploymentText')}
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
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('packages.flyouts.new.cancel')}</Btn>
                </BtnToolbar>
              }
              {
                /** If package is not selected, show only the cancel button. */
                (!packageFile) &&
                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('packages.flyouts.new.cancel')}</Btn>
                </BtnToolbar>
              }
              {
                /** After successful upload, show close button. */
                (completedSuccessfully) &&
                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('packages.flyouts.new.close')}</Btn>
                </BtnToolbar>
              }
            </SummarySection>
          </form>
        </FlyoutContent>
      </Flyout>
    );
  }
}
