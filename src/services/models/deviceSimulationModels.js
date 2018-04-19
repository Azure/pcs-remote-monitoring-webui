// Copyright (c) Microsoft. All rights reserved.

import { camelCaseReshape, getItems, reshape } from 'utilities';

export const toDeviceSimulationModel = (response = {}) => camelCaseReshape(response, {
  'etag': 'etag',
  'id': 'id',
  'enabled': 'enabled',
  'deviceModels': 'deviceModels'
});

export const toDeviceSimulationRequestModel = (request = {}) => {
  const deviceModels = (request.deviceModels || [])
    .map(toDeviceModelsRequestModel);

  const topLevel = reshape(request, {
    'etag': 'Etag',
    'id': 'Id',
    'enabled': 'Enabled'
  });

  return { ...topLevel, DeviceModels: deviceModels };
};

export const toDeviceModelsRequestModel = (deviceModel = {}) => reshape(deviceModel, {
  'id': 'Id',
  'count': 'Count'
});

export const toDeviceModelSelectOptions = (response = {}) => getItems(response)
  .map((deviceModel = {}) => camelCaseReshape(deviceModel, {
    'id': 'value',
    'name': 'label'
  }));
