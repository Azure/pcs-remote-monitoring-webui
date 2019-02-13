// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { LinkedComponent } from 'utilities';
import { permissions, toDiagnosticsModel, toSinglePropertyDiagnosticsModel } from 'services/models';
import {
  ComponentArray,
  Flyout,
  ErrorMsg,
  FormGroup,
  FormLabel,
  Protected,
  Radio
} from 'components/shared';
import {
  DeviceJobTagsContainer,
  DeviceJobMethodsContainer,
  DeviceJobPropertiesContainer
} from './';

import './deviceJobs.scss';

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

  componentDidMount() {
    this.props.logEvent(toDiagnosticsModel('Devices_NewJob_Click', {}));
  }

  onJobTypeChange = ({ target: { value } }) => {
    this.props.logEvent(toSinglePropertyDiagnosticsModel('Devices_JobType_Select', 'JobType', value));
  }

  formIsValid() {
    return [
      this.jobTypeLink
    ].every(link => !link.error);
  }

  render() {
    const {
      t,
      onClose,
      devices,
      updateTags,
      updateProperties
    } = this.props;

    return (
      <Flyout header={t('devices.flyouts.jobs.title')} t={t} onClose={onClose}>
          <Protected permission={permissions.createJobs}>
            <div className="device-jobs-container">
              {
                devices.length === 0 &&
                <ErrorMsg className="device-jobs-error">{t("devices.flyouts.jobs.noDevices")}</ErrorMsg>
              }
              {
                devices.length > 0 &&
                <ComponentArray>
                  <FormGroup>
                    <FormLabel>{t('devices.flyouts.jobs.selectJob')}</FormLabel>
                    <Radio link={this.jobTypeLink} value="tags" onClick={this.onJobTypeChange}>
                      {t('devices.flyouts.jobs.tags.radioLabel')}
                    </Radio>
                    <Radio link={this.jobTypeLink} value="methods" onClick={this.onJobTypeChange}>
                      {t('devices.flyouts.jobs.methods.radioLabel')}
                    </Radio>
                    <Radio link={this.jobTypeLink} value="properties" onClick={this.onJobTypeChange}>
                      {t('devices.flyouts.jobs.properties.radioLabel')}
                    </Radio>
                  </FormGroup>
                  {
                    this.jobTypeLink.value === 'tags'
                      ? <DeviceJobTagsContainer t={t} onClose={onClose} devices={devices} updateTags={updateTags} />
                      : null
                  }
                  {
                    this.jobTypeLink.value === 'methods'
                      ? <DeviceJobMethodsContainer t={t} onClose={onClose} devices={devices} />
                      : null
                  }
                  {
                    this.jobTypeLink.value === 'properties'
                      ? <DeviceJobPropertiesContainer t={t} onClose={onClose} devices={devices} updateProperties={updateProperties} />
                      : null
                  }
                </ComponentArray>
              }
            </div>
          </Protected>
      </Flyout>
    );
  }
}
