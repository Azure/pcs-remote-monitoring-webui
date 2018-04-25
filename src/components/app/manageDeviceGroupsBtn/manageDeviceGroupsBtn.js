// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { Btn } from 'components/shared';
import { svgs } from 'utilities';

export const ManageDeviceGroupsBtn = (props) => (
  <Btn svg={svgs.manageFilters} onClick={props.openFlyout}>
    {props.t('deviceGroupsFlyout.title')}
  </Btn>
);
