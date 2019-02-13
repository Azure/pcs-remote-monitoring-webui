// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import {
  PropertyGrid as Grid,
  PropertyGridHeader as GridHeader,
  PropertyRow as Row
} from 'components/shared';
import { compareByProperty } from 'utilities';

const DeviceGroups = ({ t, deviceGroups, onEditDeviceGroup }) => (
  <Grid>
    <GridHeader>
      <Row>
        {t('deviceGroupsFlyout.deviceGroupName')}
      </Row>
    </GridHeader>
    {
      deviceGroups.sort(compareByProperty('displayName', true)).map((deviceGroup, idx) =>
        <button onClick={onEditDeviceGroup(deviceGroup)} className="row link edit-device-group-btn" key={idx}>
          {deviceGroup.displayName}
        </button>
      )
    }
  </Grid>
);

export default DeviceGroups;
