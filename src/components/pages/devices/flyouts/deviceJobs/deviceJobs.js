// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { LinkedComponent } from 'utilities';
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
  FormGroup,
  FormLabel,
  Indicator,
  Radio,
  SectionDesc,
  SummaryCount,
  SummarySection,
  Svg
} from 'components/shared';
import {
  DeviceJobTags,
  DeviceJobMethods,
  DeviceJobProperties
} from './';

import './deviceJobs.css';

export class DeviceJobs extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPending: false,
      error: undefined,
      successCount: 0,
      changesApplied: false,
      formData: {
        jobType: 'tags'
      }
    };

    // Linked components
    this.formDataLink = this.linkTo('formData');

    this.jobTypeLink = this.formDataLink.forkTo('jobType');
  }

  formIsValid() {
    return [
      this.jobTypeLink,
      // TODO: Add links
    ].every(link => !link.error);
  }

  apply = () => {
    if (this.formIsValid()) {
      this.setState({ isPending: true });

      // TODO: Implement server calls.

      this.setState({ isPending: false });
    }
  }

  getSummaryMessage() {
    const { t } = this.props;
    const { isPending, changesApplied } = this.state;

    if (isPending) {
      return t('devices.flyouts.jobs.pending');
    } else if (changesApplied) {
      return t('devices.flyouts.jobs.applySuccess');
    } else {
      return t('devices.flyouts.jobs.affected');
    }
  }

  render() {
    const {
      t,
      onClose,
      devices
    } = this.props;
    const {
      isPending,
      error,
      successCount,
      changesApplied
    } = this.state;

    const summaryCount = changesApplied ? successCount : devices.length;
    const completedSuccessfully = changesApplied && successCount === devices.length;
    const summaryMessage = this.getSummaryMessage();

    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('devices.flyouts.jobs.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          <form className="device-jobs-container" onSubmit={this.apply}>
            <FormGroup>
              <FormLabel>{t('devices.flyouts.jobs.selectJob')}</FormLabel>
              <Radio link={this.jobTypeLink} value="tags">
                {t('devices.flyouts.jobs.tags.radioLabel')}
              </Radio>
              <Radio link={this.jobTypeLink} value="methods">
                {t('devices.flyouts.jobs.methods.radioLabel')}
              </Radio>
              <Radio link={this.jobTypeLink} value="properties">
                {t('devices.flyouts.jobs.properties.radioLabel')}
              </Radio>
            </FormGroup>

            {
              this.jobTypeLink.value === 'tags' &&
              <DeviceJobTags t={t} devices={devices} />
            }
            {
              this.jobTypeLink.value === 'methods' &&
              <DeviceJobMethods t={t} devices={devices} />
            }
            {
              this.jobTypeLink.value === 'properties' &&
              <DeviceJobProperties t={t} devices={devices} />
            }

            <SummarySection title={t('devices.flyouts.jobs.summaryHeader')}>
              <SummaryCount>{summaryCount}</SummaryCount>
              <SectionDesc>{summaryMessage}</SectionDesc>
              {this.state.isPending && <Indicator />}
              {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
            </SummarySection>

            {
              error &&
              <div className="device-jobs-error">
                <ErrorMsg>{error}</ErrorMsg>
              </div>
            }
            {
              !changesApplied &&
              <BtnToolbar>
                <Btn svg={svgs.reconfigure} primary={true} disabled={isPending} onClick={this.apply}>{t('devices.flyouts.jobs.apply')}</Btn>
                <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.jobs.cancel')}</Btn>
              </BtnToolbar>
            }
            {
              !!changesApplied &&
              <BtnToolbar>
                <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.jobs.close')}</Btn>
              </BtnToolbar>
            }
          </form>
        </FlyoutContent>
      </Flyout>
    );
  }
}
