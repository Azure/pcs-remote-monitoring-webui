// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import {
  FormSection,
  SectionDesc,
  SectionHeader
} from '../../../../shared';

export const DeviceJobTags = (props) => {
  const { t, devices } = props;
  return (
    <FormSection className="device-job-tags-container">
      <SectionHeader>{t('devices.flyouts.jobs.tags.title')}</SectionHeader>
      <SectionDesc>{t('devices.flyouts.jobs.tags.description')}</SectionDesc>
      <pre>{JSON.stringify(devices, null, 2)}</pre>
    </FormSection>
  )
};
