// Copyright (c) Microsoft. All rights reserved.

import { reshape } from 'utilities';

export const toDeviceGroupsModel = (response = {}) => (response.items || []).map(toDeviceGroupModel);

export const toDeviceGroupModel = (device = {}) => reshape(device, {
  'id': 'id',
  'displayName': 'displayName',
  'conditions': 'conditions',
  'eTag': 'eTag'
});
