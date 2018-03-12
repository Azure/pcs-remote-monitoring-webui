// Copyright (c) Microsoft. All rights reserved.

import { reshape } from 'utilities';

export const toDeviceGroupsModel = (response = {}) => (response.items || [])
  .map((device = {}) => reshape(device, {
    'id': 'id',
    'displayName': 'displayName',
    'conditions': 'conditions',
    'eTag': 'eTag'
  }));
