// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import {
  FormSection,
  SectionDesc,
  SectionHeader
} from '../../../../shared';

export const DeviceJobMethods = (props) => {
  const { t, devices } = props;
  return (
    <FormSection className="device-job-methods-container">
      <SectionHeader>{t('devices.flyouts.jobs.methods.title')}</SectionHeader>
      <SectionDesc>{t('devices.flyouts.jobs.methods.description')}</SectionDesc>
      <pre>{JSON.stringify(devices, null, 2)}</pre>
    </FormSection>
  )
};
