// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Link } from "react-router-dom";
import { Observable } from 'rxjs';

import { IoTHubManagerService } from 'services';
import { toSubmitMethodJobRequestModel, methodJobConstants } from 'services/models';
import { LinkedComponent } from 'utilities';
import { svgs, Validator } from 'utilities';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  FormControl,
  FormGroup,
  FormLabel,
  FormSection,
  Indicator,
  SectionDesc,
  SectionHeader,
  SummaryBody,
  SummaryCount,
  SummarySection,
  Svg
} from 'components/shared';

const isAlphaNumericRegex = /^[a-zA-Z0-9]*$/;
const nonAlphaNumeric = x => !x.match(isAlphaNumericRegex);

const initialState = {
  isPending: false,
  error: undefined,
  successCount: 0,
  changesApplied: false,
  jobName: undefined,
  jobId: undefined,
  methodName: undefined,
  commonMethods: []
};

export class DeviceJobMethods extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = initialState;

    // Linked components
    this.jobNameLink = this.linkTo('jobName')
      .reject(nonAlphaNumeric)
      .check(Validator.notEmpty, () => this.props.t('devices.flyouts.jobs.validation.required'));

    this.methodNameLink = this.linkTo('methodName')
      .map(({ value }) => value)
      .check(Validator.notEmpty, () => this.props.t('devices.flyouts.jobs.validation.required'));
  }

  componentDidMount() {
    if (this.props.devices) {
      this.populateState(this.props.devices);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.devices && (this.props.devices || []).length !== nextProps.devices.length) {
      this.populateState(nextProps.devices);
    }
  }

  componentWillUnmount() {
    if (this.populateStateSubscription) this.populateStateSubscription.unsubscribe();
    if (this.submitJobSubscription) this.submitJobSubscription.unsubscribe();
  }

  populateState(devices) {
    if (this.populateStateSubscription) this.populateStateSubscription.unsubscribe();
    this.populateStateSubscription = Observable.from(devices)
      .map(({ methods }) => new Set(methods))
      .reduce((commonMethods, deviceMethods) =>
        commonMethods
          ? new Set([...commonMethods].filter(method => deviceMethods.has(method)))
          : deviceMethods
      )
      .subscribe(commonMethodSet => {
        // TODO: Remove this once 'FirmwareUpdate' is removed from device simulation service
        const filteredMethods = new Set([...commonMethodSet].filter(method => method !== 'FirmwareUpdate'));
        const commonMethods = [...filteredMethods];
        this.setState({ commonMethods });
      });
  }

  formIsValid() {
    return [
      this.jobNameLink,
      this.methodNameLink
    ].every(link => !link.error);
  }

  apply = (event) => {
    event.preventDefault();
    if (this.formIsValid()) {
      this.setState({ isPending: true });

      const { devices } = this.props;
      const request = toSubmitMethodJobRequestModel(devices, this.state);

      if (this.submitJobSubscription) this.submitJobSubscription.unsubscribe();
      this.submitJobSubscription = IoTHubManagerService.submitJob(request)
        .subscribe(
          ({ jobId }) => {
            this.setState({ jobId, successCount: devices.length, isPending: false, changesApplied: true });
          },
          error => {
            this.setState({ error, isPending: false, changesApplied: true });
          }
        );
    }
  }

  isFirmwareUpdate() {
    return this.methodNameLink.value
      ? this.methodNameLink.value === methodJobConstants.firmwareUpdate
      : undefined;
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
      changesApplied,
      commonMethods = []
    } = this.state;

    const summaryCount = changesApplied ? successCount : devices.length;
    const completedSuccessfully = changesApplied && successCount === devices.length;
    const summaryMessage = this.getSummaryMessage();
    const methodOptions = (commonMethods || []).map(name => ({ value: name, label: name }));

    return (
      <form onSubmit={this.apply}>
        <FormSection className="device-job-Methods-container">
          <SectionHeader>{t('devices.flyouts.jobs.methods.title')}</SectionHeader>
          <SectionDesc>{t('devices.flyouts.jobs.methods.description')}</SectionDesc>

          <FormGroup>
            <FormLabel>{t('devices.flyouts.jobs.methods.methodName')}</FormLabel>
            <FormControl className="long" type="select" link={this.methodNameLink} options={methodOptions} placeholder={t('devices.flyouts.jobs.methods.methodNameHint')} clearable={false} searchable={true} errorState={!!error} />
          </FormGroup>

          <FormGroup>
            <FormLabel>{t('devices.flyouts.jobs.jobName')}</FormLabel>
            <div className="help-message">{t('devices.flyouts.jobs.jobNameHelpMessage')}</div>
            <FormControl className="long" link={this.jobNameLink} type="text" placeholder={t('devices.flyouts.jobs.jobNameHint')} />
          </FormGroup>

          <SummarySection>
            <SectionHeader>{t('devices.flyouts.jobs.summaryHeader')}</SectionHeader>
            <SummaryBody>
              <SummaryCount>{summaryCount}</SummaryCount>
              <SectionDesc>{summaryMessage}</SectionDesc>
              {this.state.isPending && <Indicator />}
              {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
            </SummaryBody>
          </SummarySection>

          {error && <AjaxError className="device-jobs-error" t={t} error={error} />}
          {
            !changesApplied &&
            <BtnToolbar>
              <Btn svg={svgs.reconfigure} primary={true} disabled={!this.formIsValid() || isPending} type="submit">{t('devices.flyouts.jobs.apply')}</Btn>
              <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.jobs.cancel')}</Btn>
            </BtnToolbar>
          }
          {
            !!changesApplied &&
            <BtnToolbar>
              <Link to={`/maintenance/job/${this.state.jobId}`} className="btn btn-primary">{t('devices.flyouts.jobs.viewStatus')}</Link>
              <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.jobs.close')}</Btn>
            </BtnToolbar>
          }
        </FormSection>
      </form>
    )
  }
}
