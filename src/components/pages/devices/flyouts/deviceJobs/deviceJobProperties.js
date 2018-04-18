// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import {
  FormSection,
  SectionDesc,
  SectionHeader
} from '../../../../shared';

export const DeviceJobProperties = (props) => {
  const { t, devices } = props;
  return (
    <FormSection className="device-job-properties-container">
      <SectionHeader>{t('devices.flyouts.jobs.properties.title')}</SectionHeader>
      <SectionDesc>{t('devices.flyouts.jobs.properties.description')}</SectionDesc>
      <pre>{JSON.stringify(devices, null, 2)}</pre>
    </FormSection>
  )
};
